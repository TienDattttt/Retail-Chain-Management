import React, { useState, useEffect } from "react";
import { message } from 'antd';
import { Filter, Sliders, Eye, PlusCircle } from "react-feather";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Select from "react-select";
import { Link } from "react-router-dom";
import { Archive, User } from "react-feather";
import StockTransferModal from "../../core/modals/stocks/stocktransferModal";
import ThemPhieuXuatKho from "../../core/modals/stocks/addStockTransfer";
import XemChiTietPhieuXuat from "../../core/modals/stocks/viewStockTransferDetail";
import { useSelector, useDispatch } from "react-redux";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
  fetchStockTransfers,
  setFilters,
  setPagination,
  selectStockTransfers,
  selectStockTransferLoading,
  selectStockTransferError,
  selectStockTransferPagination,
  selectStockTransferFilters,
} from '../../core/redux/stockTransferSlice';
import { fetchBranches, selectBranches } from '../../core/redux/branchSlice';

const StockTransfer = () => {
  const dispatch = useDispatch();
  const stockTransfers = useSelector(selectStockTransfers);
  const loading = useSelector(selectStockTransferLoading);
  const error = useSelector(selectStockTransferError);
  const pagination = useSelector(selectStockTransferPagination);
  const filters = useSelector(selectStockTransferFilters);
  const branches = useSelector(selectBranches);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const hienThiChiTiet = (transferId) => {
    setSelectedTransferId(transferId);
    setIsDetailModalVisible(true);
  };

  const dongModalChiTiet = () => {
    setIsDetailModalVisible(false);
    setSelectedTransferId(null);
  };

  const hienThiModalThem = () => {
    setIsAddModalVisible(true);
  };

  const dongModalThem = () => {
    setIsAddModalVisible(false);
  };

  const xuLyThanhCong = () => {
    taiDuLieuXuatKho(); // Reload data after successful creation
  };

  const taiDuLieuXuatKho = () => {
    const searchParams = {
      ...filters,
      page: pagination.currentPage,
      size: pagination.pageSize,
    };
    dispatch(fetchStockTransfers(searchParams));
  };

  useEffect(() => {
    dispatch(fetchBranches());
    taiDuLieuXuatKho();
  }, [dispatch]);

  useEffect(() => {
    taiDuLieuXuatKho();
  }, [filters.toBranchId, filters.transferDateFrom, filters.transferDateTo]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const sapXepOptions = [
    { value: 'date', label: 'Sắp xếp theo ngày' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
  ];

  const warehouseOptions = [
    { value: 1, label: "Kho Tổng" },
    { value: 2, label: "Kho Phụ" },
  ];

  const branchOptions = [
    { value: null, label: 'Tất cả chi nhánh' },
    ...branches.map(branch => ({
      value: branch.id,
      label: branch.name
    }))
  ];

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'Pending', label: 'Chờ xử lý' },
    { value: 'Completed', label: 'Hoàn thành' },
    { value: 'Cancelled', label: 'Đã hủy' },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };






  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header transfer">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Danh Sách Xuất Kho</h4>
              <h6>Quản lý xuất kho từ kho tổng đến các điểm bán lẻ</h6>
            </div>
          </div>
          <div className="d-flex purchase-pg-btn">
            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-added"
                onClick={hienThiModalThem}
              >
                <PlusCircle className="me-2"/> 
                Tạo Phiếu Xuất Kho
              </Link>
            </div>
          </div>
        </div>
        {/* /product list */}
        <div className="card table-list-card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <div className="search-input">
                  <input
                    type="text"
                    placeholder="Tìm kiếm phiếu xuất kho..."
                    className="form-control form-control-sm formsearch"
                    value={filters.searchTerm}
                    onChange={(e) => dispatch(setFilters({ searchTerm: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && taiDuLieuXuatKho()}
                  />
                  <Link to="#" className="btn btn-searchset" onClick={taiDuLieuXuatKho}>
                    <i data-feather="search" className="feather-search" />
                  </Link>
                </div>
              </div>
              <div className="search-path">
                <Link
                  className={`btn btn-filter ${
                    isFilterVisible ? "setclose" : ""
                  }`}
                  id="filter_search"
                >
                  <Filter
                    className="filter-icon"
                    onClick={toggleFilterVisibility}
                  />
                  <span onClick={toggleFilterVisibility}>
                    <ImageWithBasePath
                      src="assets/img/icons/closes.svg"
                      alt="img"
                    />
                  </span>
                </Link>
              </div>
              <div className="form-sort stylewidth">
                <Sliders className="info-img" />
                <Select
                  className="select"
                  options={sapXepOptions}
                  placeholder="Mới nhất"
                />
              </div>
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
                      <Archive className="info-img" />
                      <Select
                        className="select"
                        options={warehouseOptions}
                        placeholder="Kho xuất"
                        value={warehouseOptions.find(opt => opt.value === filters.fromWarehouseId)}
                        onChange={(selected) => dispatch(setFilters({ fromWarehouseId: selected?.value }))}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <User className="info-img" />
                      <Select
                        className="select"
                        options={branchOptions}
                        placeholder="Chi nhánh nhận"
                        value={branchOptions.find(opt => opt.value === filters.toBranchId)}
                        onChange={(selected) => dispatch(setFilters({ toBranchId: selected?.value }))}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Từ ngày"
                        value={filters.transferDateFrom || ''}
                        onChange={(e) => dispatch(setFilters({ transferDateFrom: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Đến ngày"
                        value={filters.transferDateTo || ''}
                        onChange={(e) => dispatch(setFilters({ transferDateTo: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <Select
                        className="select"
                        options={statusOptions}
                        placeholder="Trạng thái"
                        value={statusOptions.find(opt => opt.value === filters.status)}
                        onChange={(selected) => dispatch(setFilters({ status: selected?.value }))}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <Link className="btn btn-filters ms-auto" onClick={taiDuLieuXuatKho}>
                        <i data-feather="search" className="feather-search" />
                        Tìm kiếm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Filter */}
            <div className="table-responsive product-list">
              <table className="table datanew list">
                <thead>
                  <tr>
                    <th className="no-sort">
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" />
                        <span className="checkmarks" />
                      </label>
                    </th>
                    <th>Mã phiếu</th>
                    <th>Kho xuất</th>
                    <th>Chi nhánh nhận</th>
                    <th>Số sản phẩm</th>
                    <th>Tổng số lượng</th>
                    <th>Ngày xuất</th>
                    <th>Mô tả</th>
                    <th className="no-sort">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="text-center">
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Đang tải...</span>
                        </div>
                      </td>
                    </tr>
                  ) : stockTransfers.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center">
                        Không có dữ liệu phiếu xuất kho
                      </td>
                    </tr>
                  ) : (
                    stockTransfers.map((transfer) => (
                      <tr key={transfer.id}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks" />
                          </label>
                        </td>
                        <td>
                          <span className="text-primary fw-bold">{transfer.transferCode}</span>
                        </td>
                        <td>{transfer.fromWarehouseName}</td>
                        <td>{transfer.toBranchName}</td>
                        <td>
                          <span className="badge bg-info">{transfer.totalProducts}</span>
                        </td>
                        <td>
                          <span className="badge bg-primary">{transfer.totalQuantity}</span>
                        </td>
                        <td>{formatDate(transfer.transferDate)}</td>
                        <td>{transfer.description || 'Không có mô tả'}</td>
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Xem chi tiết</Tooltip>}>
                              <Link 
                                className="me-2 p-2" 
                                to="#"
                                onClick={() => hienThiChiTiet(transfer.id)}
                              >
                                <Eye className="action-eye"/>
                              </Link>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Phân trang */}
            {stockTransfers.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted">
                  Hiển thị {pagination.currentPage * pagination.pageSize + 1} - {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} của {pagination.totalElements} phiếu xuất kho
                </div>
                <div className="d-flex align-items-center">
                  <button 
                    className="btn btn-outline-primary btn-sm me-2"
                    disabled={pagination.currentPage === 0}
                    onClick={() => {
                      const newPage = pagination.currentPage - 1;
                      dispatch(setPagination({ currentPage: newPage }));
                      const searchParams = {
                        ...filters,
                        page: newPage,
                        size: pagination.pageSize,
                      };
                      dispatch(fetchStockTransfers(searchParams));
                    }}
                  >
                    « Trước
                  </button>
                  <span className="mx-3 fw-bold">
                    Trang {pagination.currentPage + 1} / {pagination.totalPages}
                  </span>
                  <button 
                    className="btn btn-outline-primary btn-sm ms-2"
                    disabled={pagination.currentPage >= pagination.totalPages - 1}
                    onClick={() => {
                      const newPage = pagination.currentPage + 1;
                      dispatch(setPagination({ currentPage: newPage }));
                      const searchParams = {
                        ...filters,
                        page: newPage,
                        size: pagination.pageSize,
                      };
                      dispatch(fetchStockTransfers(searchParams));
                    }}
                  >
                    Sau »
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* /product list */}
      </div>
      <StockTransferModal />
      <ThemPhieuXuatKho 
        isVisible={isAddModalVisible}
        onClose={dongModalThem}
        onSuccess={xuLyThanhCong}
      />
      <XemChiTietPhieuXuat 
        transferId={selectedTransferId}
        isVisible={isDetailModalVisible}
        onClose={dongModalChiTiet}
      />
    </div>
  );
};

export default StockTransfer;
