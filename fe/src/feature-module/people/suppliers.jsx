import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../../core/breadcrumbs";
import { Link } from "react-router-dom";
import { User, Edit, Trash2 } from "react-feather";
import FilterSection from "../../core/components/FilterSection";

import Select from "react-select";
import { message, Input } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SupplierModal from "../../core/modals/peoples/supplierModal";
import DataTable from "../../core/pagination/datatable";
import {
  fetchSuppliers,
  fetchSupplierById,
  toggleSupplierStatus,
  setSearchTerm,
  setStatusFilter,
  setPagination,
  selectPaginatedSuppliers,
  selectSuppliersLoading,
  selectSuppliersError,
  selectSuppliersPagination,
  selectSuppliersSearchTerm,
} from "../../core/redux/supplierSlice";

const { Search } = Input;

const Suppliers = () => {
  const dispatch = useDispatch();
  const suppliers = useSelector(selectPaginatedSuppliers);
  const loading = useSelector(selectSuppliersLoading);
  const error = useSelector(selectSuppliersError);
  const pagination = useSelector(selectSuppliersPagination);
  const searchTerm = useSelector(selectSuppliersSearchTerm);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [statusFilter, setLocalStatusFilter] = useState('all');
  
  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const handleSearch = (value) => {
    dispatch(setSearchTerm(value));
  };

  const handleAddSupplier = () => {
    setEditingSupplierId(null);
    setModalVisible(true);
  };

  const handleEditSupplier = async (supplierId) => {
    try {
      await dispatch(fetchSupplierById(supplierId)).unwrap();
      setEditingSupplierId(supplierId);
      setModalVisible(true);
    } catch (error) {
      message.error('Không thể tải thông tin nhà cung cấp');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingSupplierId(null);
    dispatch(fetchSuppliers()); // Refresh data
  };

  const handlePageChange = (page, pageSize) => {
    dispatch(setPagination({ currentPage: page, pageSize }));
  };

  const handleToggleStatus = async (supplierId) => {
    try {
      const result = await dispatch(toggleSupplierStatus(supplierId)).unwrap();
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Thành công!',
        text: result.message,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      const MySwal = withReactContent(Swal);
      MySwal.fire('Lỗi!', 'Không thể thay đổi trạng thái nhà cung cấp.', 'error');
    }
  };

  const handleStatusFilter = (value) => {
    setLocalStatusFilter(value);
    dispatch(setStatusFilter(value));
  };

  const options = [
    { value: "sortByDate", label: "Sort by Date" },
    { value: "140923", label: "14 09 23" },
    { value: "110923", label: "11 09 23" },
  ];
  const statusOptions = [
    { label: "Tất cả trạng thái", value: "all" },
    { label: "Hoạt động", value: "active" },
    { label: "Không hoạt động", value: "inactive" },
  ];

  const columns = [
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="supplier-name">
          <Link to="#" className="text-decoration-none">
            {text}
          </Link>
        </span>
      ),
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
    },
    {
      title: "Điện thoại",
      dataIndex: "contactNumber",
      key: "contactNumber",
      sorter: (a, b) => (a.contactNumber || '').localeCompare(b.contactNumber || ''),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (text) => text || '-',
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`status-${record.id}`}
            checked={isActive}
            onChange={() => handleToggleStatus(record.id)}
          />
          <label className="form-check-label" htmlFor={`status-${record.id}`}>
            {isActive ? 'Hoạt động' : 'Không hoạt động'}
          </label>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <button
              className="me-2 p-2 btn btn-link"
              onClick={() => handleEditSupplier(record.id)}
              style={{ border: 'none', background: 'none' }}
            >
              <Edit className="feather-edit" />
            </button>
            <button
              className="confirm-text p-2 btn btn-link"
              onClick={() => showConfirmationAlert(record.id)}
              style={{ border: 'none', background: 'none' }}
            >
              <Trash2 className="feather-trash-2" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = (supplierId) => {
    MySwal.fire({
      title: "Xác nhận thay đổi trạng thái",
      text: "Bạn có chắc chắn muốn thay đổi trạng thái nhà cung cấp này?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Có, thay đổi!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        handleToggleStatus(supplierId);
      }
    });
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Danh sách nhà cung cấp"
          subtitle="Quản lý nhà cung cấp"
          addButton="Thêm nhà cung cấp"
          onAddClick={handleAddSupplier}
        />
        {/* /product list */}
        <div className="card table-list-card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <Search
                  placeholder="Tìm kiếm nhà cung cấp..."
                  allowClear
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onSearch={handleSearch}
                  style={{ width: 300 }}
                />
              </div>
              <FilterSection
                isFilterVisible={isFilterVisible}
                toggleFilterVisibility={toggleFilterVisibility}
                sortComponent={
                  <Select
                    className="select"
                    options={options}
                    placeholder="Sort by Date"
                  />
                }
              />
            </div>
            {/* /Filter */}
            <div
              className={`card${isFilterVisible ? " visible" : ""}`}
              id="filter_inputs"
              style={{ display: isFilterVisible ? "block" : "none" }}
            >
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <User className="info-img" />
                      <Select
                        options={statusOptions}
                        placeholder="Lọc theo trạng thái"
                        value={statusOptions.find(opt => opt.value === statusFilter)}
                        onChange={(option) => handleStatusFilter(option.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                    <div className="input-blocks">
                      <button 
                        className="btn btn-filters ms-auto"
                        onClick={() => {
                          dispatch(setSearchTerm(''));
                          dispatch(setStatusFilter('all'));
                          setLocalStatusFilter('all');
                        }}
                      >
                        <i className="feather-refresh-cw" /> Đặt lại
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Filter */}
            <div className="table-responsive">
              <DataTable
                columns={columns}
                dataSource={suppliers}
                loading={loading}
                pagination={{
                  current: pagination.currentPage,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} nhà cung cấp`,
                }}
                onChange={handlePageChange}
                rowKey="id"
              />
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>

      <SupplierModal
        visible={modalVisible}
        onCancel={handleModalClose}
        supplierId={editingSupplierId}
      />
    </div>
  );
};

export default Suppliers;
