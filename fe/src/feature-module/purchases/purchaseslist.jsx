import React, { useState, useEffect } from 'react'
import { message } from 'antd';
import ImageWithBasePath from '../../core/img/imagewithbasebath'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ChevronUp, Eye, Filter, PlusCircle, Sliders, User } from 'feather-icons-react/build/IconComponents';
import { setToogleHeader } from '../../core/redux/action';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import ThemDonNhapHang from '../../core/modals/purchases/addpurchases';

import EditPurchases from '../../core/modals/purchases/editpurchases';
import XemChiTietPhieuNhap from '../../core/modals/purchases/viewpurchasedetail';

import {
  fetchPurchaseOrders,
  setFilters,
  setPagination,
  selectPurchaseOrders,
  selectPurchaseLoading,
  selectPurchaseError,
  selectPurchasePagination,
  selectPurchaseFilters,
} from '../../core/redux/purchaseSlice';
import { fetchSuppliers, selectSuppliers } from '../../core/redux/supplierSlice';

const DanhSachNhapHang = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const purchaseOrders = useSelector(selectPurchaseOrders);
    const loading = useSelector(selectPurchaseLoading);
    const error = useSelector(selectPurchaseError);
    const pagination = useSelector(selectPurchasePagination);
    const filters = useSelector(selectPurchaseFilters);
    const suppliers = useSelector(selectSuppliers);

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    const taiDuLieuNhapHang = () => {
        const searchParams = {
            ...filters,
            page: pagination.currentPage,
            size: pagination.pageSize,
        };
        dispatch(fetchPurchaseOrders(searchParams));
    };

    useEffect(() => {
        dispatch(fetchSuppliers());
        taiDuLieuNhapHang();
    }, [dispatch]);

    useEffect(() => {
        taiDuLieuNhapHang();
    }, [filters.supplierId, filters.purchaseDateFrom, filters.purchaseDateTo]);



    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);
    
    const chuyenDoiHienThiBo = () => {
        setIsFilterVisible((prevVisibility) => !prevVisibility);
    };
    
    const sapXepOptions = [
        { value: 'date', label: 'Sắp xếp theo ngày' },
        { value: 'newest', label: 'Mới nhất' },
        { value: 'oldest', label: 'Cũ nhất' },
    ];

    const nhaCungCapOptions = [
        { value: null, label: 'Tất cả nhà cung cấp' },
        ...suppliers.map(supplier => ({
            value: supplier.id,
            label: supplier.name
        }))
    ];

    const renderCollapseTooltip = (props) => (
        <Tooltip id="collapse-tooltip" {...props}>
            Thu gọn
        </Tooltip>
    );


    const hienThiChiTiet = (purchaseOrderId) => {
        setSelectedPurchaseId(purchaseOrderId);
        setIsDetailModalVisible(true);
    };

    const dongModalChiTiet = () => {
        setIsDetailModalVisible(false);
        setSelectedPurchaseId(null);
    };



    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header transfer">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>Nhập Kho</h4>
                                <h6>Quản lý các đơn nhập hàng từ nhà cung cấp</h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                                    <Link
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        id="collapse-header"
                                        className={data ? "active" : ""}
                                        onClick={() => { dispatch(setToogleHeader(!data)) }}
                                    >
                                        <ChevronUp />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                        </ul>
                        <div className="d-flex purchase-pg-btn">
                            <div className="page-btn">
                                <Link
                                    to="#"
                                    className="btn btn-added"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add-units"
                                >
                                    <PlusCircle className="me-2"/> 
                                    Thêm Đơn Nhập Kho
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
                                            placeholder="Tìm kiếm đơn nhập hàng..."
                                            className="form-control form-control-sm formsearch"
                                            value={filters.searchTerm}
                                            onChange={(e) => dispatch(setFilters({ searchTerm: e.target.value }))}
                                            onKeyDown={(e) => e.key === 'Enter' && taiDuLieuNhapHang()}
                                        />
                                        <Link to="#" className="btn btn-searchset" onClick={taiDuLieuNhapHang}>
                                            <i data-feather="search" className="feather-search" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="search-path">
                                    <Link className={`btn btn-filter ${isFilterVisible ? "setclose" : ""}`} id="filter_search">
                                        <Filter
                                            className="filter-icon"
                                            onClick={chuyenDoiHienThiBo}
                                        />
                                        <span onClick={chuyenDoiHienThiBo}>
                                            <ImageWithBasePath src="assets/img/icons/closes.svg" alt="img" />
                                        </span>
                                    </Link>
                                </div>
                                <div className="form-sort">
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
                                                <User className="info-img"/>
                                                <Select 
                                                    options={nhaCungCapOptions} 
                                                    className="select" 
                                                    placeholder="Chọn nhà cung cấp"
                                                    value={nhaCungCapOptions.find(opt => opt.value === filters.supplierId)}
                                                    onChange={(selected) => dispatch(setFilters({ supplierId: selected?.value }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="Từ ngày"
                                                    value={filters.purchaseDateFrom || ''}
                                                    onChange={(e) => dispatch(setFilters({ purchaseDateFrom: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="Đến ngày"
                                                    value={filters.purchaseDateTo || ''}
                                                    onChange={(e) => dispatch(setFilters({ purchaseDateTo: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <Link className="btn btn-filters ms-auto" onClick={taiDuLieuNhapHang}>
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
                                <table className="table  datanew list">
                                    <thead>
                                        <tr>
                                            <th className="no-sort">
                                                <label className="checkboxs">
                                                    <input type="checkbox" id="select-all" />
                                                    <span className="checkmarks" />
                                                </label>
                                            </th>
                                            <th>Mã đơn hàng</th>
                                            <th>Ngày nhập</th>
                                            <th>Kho hàng</th>
                                            <th>Nhà cung cấp</th>
                                            <th>Tổng tiền</th>
                                            <th>Mô tả</th>
                                            <th>Ngày tạo</th>
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
                                        ) : purchaseOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="text-center">
                                                    Không có dữ liệu đơn nhập hàng
                                                </td>
                                            </tr>
                                        ) : (
                                            purchaseOrders.map((order) => (
                                                <tr key={order.purchaseOrderId}>
                                                    <td>
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <span className="text-primary fw-bold">{order.code}</span>
                                                    </td>
                                                    <td>{new Date(order.purchaseDate).toLocaleDateString('vi-VN')}</td>
                                                    <td>{order.warehouseName || `Kho ${order.warehouseId}`}</td>
                                                    <td>{order.supplierName || 'Chưa có'}</td>
                                                    <td>
                                                        <span className="text-success fw-bold">
                                                            {order.totalPayment?.toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }) || '0 ₫'}
                                                        </span>
                                                    </td>
                                                    <td>{order.description || 'Không có mô tả'}</td>
                                                    <td>{new Date(order.createdDate).toLocaleDateString('vi-VN')}</td>
                                                    <td className="action-table-data">
                                                        <div className="edit-delete-action">
                                                            <OverlayTrigger placement="top" overlay={<Tooltip>Xem chi tiết</Tooltip>}>
                                                                <Link 
                                                                    className="me-2 p-2" 
                                                                    to="#"
                                                                    onClick={() => hienThiChiTiet(order.purchaseOrderId)}
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
                            {purchaseOrders.length > 0 && (
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    {/* <div className="text-muted">
                                        Hiển thị {pagination.currentPage * pagination.pageSize + 1} - {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} của {pagination.totalElements} đơn nhập hàng
                                    </div> */}
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
                                                dispatch(fetchPurchaseOrders(searchParams));
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
                                                dispatch(fetchPurchaseOrders(searchParams));
                                            }}
                                        >
                                            Sau »
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* /danh sách nhập hàng */}
                </div>
            </div>
        <ThemDonNhapHang />
        <EditPurchases />
        <XemChiTietPhieuNhap 
            purchaseOrderId={selectedPurchaseId}
            isVisible={isDetailModalVisible}
            onClose={dongModalChiTiet}
        />
        </div>
    )
}

export default DanhSachNhapHang
