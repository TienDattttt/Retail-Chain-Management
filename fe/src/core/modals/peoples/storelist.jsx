import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Filter, Sliders, Edit, Trash2 } from "react-feather";
import { message, Input, Select as AntSelect, Tag } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Breadcrumbs from "../../breadcrumbs";
import BranchModal from "./BranchModal";
import DataTable from "../../pagination/datatable";
import {
  fetchBranches,
  fetchBranchById,
  setSearchTerm,
  setStatusFilter,
  setPagination,
  selectPaginatedBranches,
  selectBranchesLoading,
  selectBranchesError,
  selectBranchesPagination,
  selectBranchesSearchTerm,
  selectBranchesStatusFilter,
} from "../../redux/branchSlice";

const { Search } = Input;

const StoreList = () => {
  const dispatch = useDispatch();
  const branches = useSelector(selectPaginatedBranches);
  const loading = useSelector(selectBranchesLoading);
  const error = useSelector(selectBranchesError);
  const pagination = useSelector(selectBranchesPagination);
  const searchTerm = useSelector(selectBranchesSearchTerm);
  const statusFilter = useSelector(selectBranchesStatusFilter);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  useEffect(() => {
    dispatch(fetchBranches());
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

  const handleStatusFilter = (value) => {
    dispatch(setStatusFilter(value));
  };

  const handleAddBranch = () => {
    setEditingBranchId(null);
    setModalVisible(true);
  };

  const handleEditBranch = async (branchId) => {
    try {
      await dispatch(fetchBranchById(branchId)).unwrap();
      setEditingBranchId(branchId);
      setModalVisible(true);
    } catch (error) {
      message.error('Không thể tải thông tin chi nhánh');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingBranchId(null);
    dispatch(fetchBranches()); // Refresh data
  };

  const handlePageChange = (page, pageSize) => {
    dispatch(setPagination({ currentPage: page, pageSize }));
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' },
  ];

  const columns = [
    {
      title: "Tên chi nhánh",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: "Mã chi nhánh",
      dataIndex: "branchCode",
      key: "branchCode",
      sorter: (a, b) => (a.branchCode || '').localeCompare(b.branchCode || ''),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (text) => text || '-',
    },
    {
      title: "Thành phố",
      dataIndex: "cityName",
      key: "cityName",
      render: (text) => text || '-',
    },
    {
      title: "Điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => text || '-',
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text || '-',
    },
    {
      title: "Cấp độ",
      dataIndex: "level",
      key: "level",
      render: (level) => {
        const levelMap = {
          1: 'Trụ sở chính',
          2: 'Chi nhánh',
          3: 'Cửa hàng'
        };
        return levelMap[level] || '-';
      },
    },
    {
      title: "Loại",
      dataIndex: "isMain",
      key: "isMain",
      render: (isMain) => (
        <Tag color={isMain ? 'gold' : 'blue'}>
          {isMain ? 'Chi nhánh chính' : 'Chi nhánh phụ'}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div className="edit-delete-action">
          <Link 
            className="me-2 p-2" 
            to="#"
            onClick={() => handleEditBranch(record.id)}
          >
            <Edit className="feather-edit" />
          </Link>
          <Link
            className="confirm-text p-2"
            to="#"
            onClick={() => showConfirmationAlert()}
          >
            <Trash2 className="feather-trash-2" />
          </Link>
        </div>
      ),
    },
  ];

  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = () => {
    MySwal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Có, xóa!",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Implement delete functionality
        MySwal.fire({
          title: "Đã xóa!",
          text: "Chi nhánh đã được xóa.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    });
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Danh sách chi nhánh"
          subtitle="Quản lý chi nhánh"
          addButton="Thêm chi nhánh"
          onAddClick={handleAddBranch}
        />

        <div className="card table-list-card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <Search
                  placeholder="Tìm kiếm chi nhánh..."
                  allowClear
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onSearch={handleSearch}
                  style={{ width: 300 }}
                />
              </div>
              <div className="search-path">
                <div className="d-flex align-items-center">
                  <Link className={`btn btn-filter ${isFilterVisible ? "setclose" : ""}`} id="filter_search">
                    <Filter
                      className="filter-icon"
                      onClick={toggleFilterVisibility}
                    />
                  </Link>
                </div>
              </div>
              <div className="form-sort">
                <Sliders className="info-img" />
                <AntSelect
                  style={{ width: 200 }}
                  placeholder="Lọc theo trạng thái"
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  options={statusOptions}
                />
              </div>
            </div>
            
            <div className="table-responsive">
              <DataTable
                columns={columns}
                dataSource={branches}
                loading={loading}
                pagination={{
                  current: pagination.currentPage,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} chi nhánh`,
                }}
                onChange={handlePageChange}
                rowKey="id"
              />
            </div>
          </div>
        </div>
      </div>

      <BranchModal
        visible={modalVisible}
        onCancel={handleModalClose}
        branchId={editingBranchId}
      />
    </div>
  );
};

export default StoreList;
