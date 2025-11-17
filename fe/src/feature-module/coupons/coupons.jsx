import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumbs from '../../core/breadcrumbs';
import { Edit, Trash2, ChevronDown, ChevronRight } from 'react-feather';
import { message, Input, Select as AntSelect, Tag, Table, Button, Space } from 'antd';
import FilterSection from '../../core/components/FilterSection';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import VoucherModal from '../../core/modals/coupons/VoucherModal';
import { voucherService } from '../../core/api/voucherService';
import {
  fetchVouchers,
  fetchVoucherById,
  setSearchTerm,
  setStatusFilter,
  setPagination,
  selectPaginatedVouchers,
  selectVouchersLoading,
  selectVouchersError,
  selectVouchersPagination,
  selectVouchersSearchTerm,
  selectVouchersStatusFilter,
} from '../../core/redux/voucherSlice';

const { Search } = Input;

const Coupons = () => {
  const dispatch = useDispatch();
  const campaigns = useSelector(selectPaginatedVouchers); // Đây sẽ là campaigns
  const loading = useSelector(selectVouchersLoading);
  const error = useSelector(selectVouchersError);
  const pagination = useSelector(selectVouchersPagination);
  const searchTerm = useSelector(selectVouchersSearchTerm);
  const statusFilter = useSelector(selectVouchersStatusFilter);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingVoucherId, setEditingVoucherId] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [vouchersByCampaign, setVouchersByCampaign] = useState({});
  
  useEffect(() => {
    dispatch(fetchVouchers());
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

  const handleAddVoucher = () => {
    setEditingVoucherId(null);
    setModalVisible(true);
  };

  const handleEditVoucher = async (voucherId) => {
    try {
      await dispatch(fetchVoucherById(voucherId)).unwrap();
      setEditingVoucherId(voucherId);
      setModalVisible(true);
    } catch (error) {
      message.error('Không thể tải thông tin mã giảm giá');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingVoucherId(null);
    dispatch(fetchVouchers()); // Refresh data
  };

  const handlePageChange = (page, pageSize) => {
    dispatch(setPagination({ currentPage: page, pageSize }));
  };

  // Load vouchers when expanding a campaign
  const handleExpand = async (expanded, record) => {
    if (expanded && !vouchersByCampaign[record.id]) {
      try {
        const vouchers = await voucherService.getVouchersByCampaign(record.id);
        setVouchersByCampaign(prev => ({
          ...prev,
          [record.id]: vouchers
        }));
      } catch (error) {
        message.error('Không thể tải danh sách voucher');
      }
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' },
  ];

  // Columns cho campaign table
  const campaignColumns = [
    {
      title: "Tên chiến dịch",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: "Mã chiến dịch",
      dataIndex: "code",
      key: "code",
      render: (code) => (
        <Tag color="blue">{code}</Tag>
      ),
      sorter: (a, b) => (a.code || '').localeCompare(b.code || ''),
    },
    {
      title: "Loại giảm giá",
      dataIndex: "discountType",
      key: "discountType",
      render: (type) => (
        <span>{type === 1 ? 'Cố định' : 'Phần trăm'}</span>
      ),
    },
    {
      title: "Giá trị giảm",
      dataIndex: "discountValue",
      key: "discountValue",
      render: (value, record) => (
        <span>
          {record.discountType === 1 
            ? `${value?.toLocaleString()} VNĐ` 
            : `${value}%`
          }
        </span>
      ),
    },
    {
      title: "Số lượng voucher",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <span>
          {record.isUnlimited ? 'Không giới hạn' : quantity || 0}
        </span>
      ),
    },
    {
      title: "Đã sử dụng",
      dataIndex: "usedQuantity",
      key: "usedQuantity",
      render: (used) => used || 0,
    },
    {
      title: "Thời gian áp dụng",
      key: "dateRange",
      render: (_, record) => (
        <div>
          <div><small>Từ: {record.startDate ? new Date(record.startDate).toLocaleDateString('vi-VN') : '-'}</small></div>
          <div><small>Đến: {record.endDate ? new Date(record.endDate).toLocaleDateString('vi-VN') : '-'}</small></div>
        </div>
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
        <Space>
          <Button 
            type="link" 
            size="small"
            icon={<Edit size={16} />}
            onClick={() => handleEditVoucher(record.id)}
          >
            Sửa
          </Button>
          <Button 
            type="link" 
            size="small"
            danger
            icon={<Trash2 size={16} />}
            onClick={() => showConfirmationAlert()}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Columns cho voucher table (hiển thị trong expanded row)
  const voucherColumns = [
    {
      title: "Mã voucher",
      dataIndex: "code",
      key: "code",
      render: (code) => <Tag color="green">{code}</Tag>,
    },
    {
      title: "Trạng thái sử dụng",
      dataIndex: "isUsed",
      key: "isUsed",
      render: (isUsed) => (
        <Tag color={isUsed ? 'red' : 'blue'}>
          {isUsed ? 'Đã sử dụng' : 'Chưa sử dụng'}
        </Tag>
      ),
    },
    {
      title: "Ngày sử dụng",
      dataIndex: "usedDate",
      key: "usedDate",
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: "Khách hàng",
      dataIndex: "customerId",
      key: "customerId",
      render: (customerId) => customerId || '-',
    },
    {
      title: "Đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (orderId) => orderId || '-',
    },
  ];

  // Render expanded row content
  const expandedRowRender = (record) => {
    const vouchers = vouchersByCampaign[record.id] || [];
    
    if (vouchers.length === 0) {
      return (
        <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
          Chưa có voucher nào được tạo cho chiến dịch này
        </div>
      );
    }

    return (
      <Table
        columns={voucherColumns}
        dataSource={vouchers}
        pagination={false}
        size="small"
        rowKey="id"
        style={{ margin: '0 48px' }}
      />
    );
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
          text: "Mã giảm giá đã được xóa.",
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
          maintitle="Danh sách chiến dịch giảm giá"
          subtitle="Quản lý chiến dịch và voucher"
          addButton="Thêm chiến dịch"
          onAddClick={handleAddVoucher}
        />
        <div className="card table-list-card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <Search
                  placeholder="Tìm kiếm chiến dịch..."
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
                  <AntSelect
                    className="select"
                    style={{ width: 200 }}
                    placeholder="Lọc theo trạng thái"
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    options={statusOptions}
                  />
                }
              />
            </div>

            {/* Filter Panel */}
            {isFilterVisible && (
              <div className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <AntSelect
                        style={{ width: '100%' }}
                        placeholder="Loại giảm giá"
                        allowClear
                        options={[
                          { value: 1, label: 'Cố định' },
                          { value: 2, label: 'Phần trăm' }
                        ]}
                      />
                    </div>
                    <div className="col-md-3">
                      <Input placeholder="Giá trị giảm từ..." />
                    </div>
                    <div className="col-md-3">
                      <Input placeholder="Giá trị giảm đến..." />
                    </div>
                    <div className="col-md-3">
                      <Button type="primary">Áp dụng</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="table-responsive">
              <Table
                columns={campaignColumns}
                dataSource={campaigns}
                loading={loading}
                expandable={{
                  expandedRowRender,
                  onExpand: handleExpand,
                  expandedRowKeys,
                  onExpandedRowsChange: setExpandedRowKeys,
                  expandIcon: ({ expanded, onExpand, record }) => (
                    <Button
                      type="text"
                      size="small"
                      icon={expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      onClick={(e) => onExpand(record, e)}
                    />
                  ),
                }}
                pagination={{
                  current: pagination.currentPage,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} chiến dịch`,
                  onChange: handlePageChange,
                }}
                rowKey="id"
                size="middle"
              />
            </div>
          </div>
        </div>
      </div>

      <VoucherModal
        visible={modalVisible}
        onCancel={handleModalClose}
        voucherId={editingVoucherId}
      />
    </div>
  );
}

export default Coupons
