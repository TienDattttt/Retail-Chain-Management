import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../../core/breadcrumbs";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "react-feather";
import { message, Input } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import BranchModal from "../../core/modals/peoples/BranchModal";
import DataTable from "../../core/pagination/datatable";
import FilterSection from "../../core/components/FilterSection";
import {
  fetchBranches,
  fetchBranchById,
  upsertBranch,
  setSearchTerm,
  setPagination,
  selectPaginatedBranches,
  selectBranchesLoading,
  selectBranchesError,
  selectBranchesPagination,
  selectBranchesSearchTerm,
} from "../../core/redux/branchSlice";

const { Search } = Input;

const Branches = () => {
  const dispatch = useDispatch();
  const branches = useSelector(selectPaginatedBranches);
  const loading = useSelector(selectBranchesLoading);
  const error = useSelector(selectBranchesError);
  const pagination = useSelector(selectBranchesPagination);
  const searchTerm = useSelector(selectBranchesSearchTerm);

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
      message.error('Không thể tải thông tin cửa hàng');
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

  const handleToggleStatus = async (branchId) => {
    try {
      // Tìm branch hiện tại để lấy trạng thái
      const currentBranch = branches.find(b => b.id === branchId);
      if (!currentBranch) {
        message.error('Không tìm thấy thông tin cửa hàng');
        return;
      }

      // Tạo object để toggle status
      const toggleData = {
        id: branchId,
        isActive: !currentBranch.isActive
      };

      const result = await dispatch(upsertBranch(toggleData)).unwrap();
      message.success(result.message || 'Thay đổi trạng thái thành công');
    } catch (error) {
      message.error('Không thể thay đổi trạng thái cửa hàng');
    }
  };

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
          text: "Cửa hàng đã được xóa.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    });
  };

  const columns = [
    {
      title: "Tên cửa hàng",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (text) => text || '-',
    },
    {
      title: "Số điện thoại",
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

  return (
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Danh sách cửa hàng"
          subtitle="Quản lý cửa hàng"
          addButton="Thêm cửa hàng"
          onAddClick={handleAddBranch}
        />

        <div className="card table-list-card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <Search
                  placeholder="Tìm kiếm cửa hàng..."
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
              />
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
                    `${range[0]}-${range[1]} của ${total} cửa hàng`,
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

export default Branches;