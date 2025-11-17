import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ChevronUp, Download, Eye, Filter, PlusCircle, RotateCcw, Sliders, StopCircle, User } from 'feather-icons-react/build/IconComponents';
import { setToogleHeader } from '../../core/redux/action';
import Select from 'react-select';
import AddPurchases from '../../core/modals/purchases/addpurchases';
import ImportPurchases from '../../core/modals/purchases/importpurchases';
import EditPurchases from '../../core/modals/purchases/editpurchases';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Table from '../../core/pagination/datatable';
import {
  fetchPurchaseOrders,
  setFilters,
  setPagination,
  resetFilters,
  selectPurchaseOrders,
  selectPurchaseLoading,
  selectPurchaseError,
  selectPurchasePagination,
  selectPurchaseFilters,
} from '../../core/redux/purchaseSlice';
import { fetchBranches, selectBranches } from '../../core/redux/branchSlice';
import { fetchSuppliers, selectSuppliers } from '../../core/redux/supplierSlice';

const PurchasesList = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const purchaseOrders = useSelector(selectPurchaseOrders);
    const loading = useSelector(selectPurchaseLoading);
    const error = useSelector(selectPurchaseError);
    const pagination = useSelector(selectPurchasePagination);
    const filters = useSelector(selectPurchaseFilters);
    const branches = useSelector(selectBranches);
    const suppliers = useSelector(selectSuppliers);

    const [isFilterVisible, setIsFilterVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchBranches());
        dispatch(fetchSuppliers());
    }, [dispatch]);

    const loadPurchaseData = React.useCallback(() => {
        const searchParams = {
            ...filters,
            page: pagination.currentPage,
            size: pagination.pageSize,
        };
        dispatch(fetchPurchaseOrders(searchParams));
    }, [dispatch, filters, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        loadPurchaseData();
    }, [loadPurchaseData]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const toggleFilterVisibility = () => {
        setIsFilterVisible((prevVisibility) => !prevVisibility);
    };

    const handleFilterChange = (key, value) => {
        dispatch(setFilters({ [key]: value }));
    };

    const handleSearch = () => {
        dispatch(setPagination({ currentPage: 0 }));
    };

    const handleReset = () => {
        dispatch(resetFilters());
    };

    const handlePageChange = (page, pageSize) => {
        dispatch(setPagination({ currentPage: page - 1, pageSize }));
    };

    const sortOptions = [
        { value: 'createdDate', label: 'Ngày tạo' },
        { value: 'purchaseDate', label: 'Ngày nhập hàng' },
        { value: 'code', label: 'Mã đơn hàng' },
        { value: 'supplierName', label: 'Nhà cung cấp' },
        { value: 'totalPayment', label: 'Tổng tiền' },
    ];

    const supplierOptions = [
        { value: null, label: 'Tất cả nhà cung cấp' },
        ...suppliers.map(supplier => ({
            value: supplier.id,
            label: supplier.name
        }))
    ];

    const warehouseOptions = [
        { value: null, label: 'Tất cả kho' },
        ...branches.map(branch => ({
            value: branch.id,
            label: branch.name
        }))
    ];

    const statusOptions = [
        { value: null, label: 'Tất cả trạng thái' },
        { value: 1, label: 'Đang xử lý' },
        { value: 2, label: 'Đã hoàn thành' },
        { value: 3, label: 'Đã hủy' },
    ];

    const getStatusBadge = (statusName) => {
        switch (statusName?.toLowerCase()) {
            case 'completed':
            case 'đã hoàn thành':
                return <span className="badges status-badge">Đã hoàn thành</span>;
            case 'processing':
            case 'đang xử lý':
                return <span className="badges status-badge ordered">Đang xử lý</span>;
            case 'cancelled':
            case 'đã hủy':
                return <span className="badges unstatus-badge">Đã hủy</span>;
            default:
                return <span className="badges unstatus-badge">Chưa xác định</span>;
        }
    };

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "code",
            key: "code",
            render: (text) => (
                <Link to="#" className="text-primary">
                    {text}
                </Link>
            ),
            sorter: (a, b) => a.code.localeCompare(b.code),
        },
        {
            title: "Ngày nhập hàng",
            dataIndex: "purchaseDate",
            key: "purchaseDate",
            render: (date) => {
                if (!date) return "-";
                return new Date(date).toLocaleDateString("vi-VN");
            },
            sorter: (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate),
        },
        {
            title: "Kho",
            dataIndex: "warehouseName",
            key: "warehouseName",
            render: (text) => text || "-",
        },
        {
            title: "Nhà cung cấp",
            dataIndex: "supplierName",
            key: "supplierName",
            render: (text) => text || "-",
            sorter: (a, b) => (a.supplierName || "").localeCompare(b.supplierName || ""),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPayment",
            key: "totalPayment",
            render: (amount) => (
                <div className="text-end">
                    <strong>
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(amount || 0)}
                    </strong>
                </div>
            ),
            sorter: (a, b) => (a.totalPayment || 0) - (b.totalPayment || 0),
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (text) => (
                <div style={{ maxWidth: 200 }}>
                    {text ? (text.length > 50 ? `${text.substring(0, 50)}...` : text) : "-"}
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "statusName",
            key: "statusName",
            render: (status) => getStatusBadge(status),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdDate",
            key: "createdDate",
            render: (date) => {
                if (!date) return "-";
                return new Date(date).toLocaleDateString("vi-VN");
            },
            sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <div className="edit-delete-action">
                    <Link className="me-2 p-2" to="#" title="Xem chi tiết">
                        <Eye className="action-eye"/>
                    </Link>
                    <Link
                        className="me-2 p-2"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit-units"
                        title="Chỉnh sửa"
                    >
                        <i data-feather="edit" className="feather-edit" />
                    </Link>
                    <Link 
                        className="confirm-text p-2" 
                        to="#" 
                        onClick={showConfirmationAlert}
                        title="Xóa"
                    >
                        <i data-feather="trash-2" className="feather-trash-2" />
                    </Link>
                </div>
            ),
        },
    ];

    const renderTooltip = (props) => (
        <Tooltip id="pdf-tooltip" {...props}>
            Pdf
        </Tooltip>
    );
    const renderExcelTooltip = (props) => (
        <Tooltip id="excel-tooltip" {...props}>
            Excel
        </Tooltip>
    );
    const renderPrinterTooltip = (props) => (
        <Tooltip id="printer-tooltip" {...props}>
            Printer
        </Tooltip>
    );
    const renderRefreshTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Refresh
        </Tooltip>
    );
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonColor: '#ff0000',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    title: 'Deleted!',
                    text: 'Your file has been deleted.',
                    className: "btn btn-success",
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-success',
                    },
                });
            } else {
                MySwal.close();
            }
        });
    };

    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header transfer">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>Danh sách nhập hàng</h4>
                                <h6>Quản lý đơn nhập hàng từ nhà cung cấp</h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link>
                                        <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                            <li>
                                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                                    <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                        <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                            <li>
                                <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                                    <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                        <i data-feather="printer" className="feather-printer" />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                            <li>
                                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                                    <Link data-bs-toggle="tooltip" data-bs-placement="top" onClick={loadPurchaseData}>
                                        <RotateCcw />
                                    </Link>
                                </OverlayTrigger>
                            </li>
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
                                    Thêm đơn nhập hàng
                                </Link>
                            </div>
                            <div className="page-btn import">
                                <Link
                                    to="#"
                                    className="btn btn-added color"
                                    data-bs-toggle="modal"
                                    data-bs-target="#view-notes"
                                >
                                    <Download className="me-2"/>
                                    Import đơn hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card table-list-card">
                        <div className="card-body">
                            <div className="table-top">
                                <div className="search-set">
                                    <div className="search-input">
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm đơn hàng..."
                                            className="form-control form-control-sm formsearch"
                                            value={filters.searchTerm}
                                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                        <Link to="#" className="btn btn-searchset" onClick={handleSearch}>
                                            <i data-feather="search" className="feather-search" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="search-path">
                                    <Link className={`btn btn-filter ${isFilterVisible ? "setclose" : ""}`} id="filter_search">
                                        <Filter
                                            className="filter-icon"
                                            onClick={toggleFilterVisibility}
                                        />
                                        <span onClick={toggleFilterVisibility}>
                                            <ImageWithBasePath src="assets/img/icons/closes.svg" alt="img" />
                                        </span>
                                    </Link>
                                </div>
                                <div className="form-sort">
                                    <Sliders className="info-img" />
                                    <Select
                                        className="select"
                                        options={sortOptions}
                                        placeholder="Sắp xếp theo"
                                        value={sortOptions.find(opt => opt.value === filters.sortBy)}
                                        onChange={(option) => handleFilterChange('sortBy', option.value)}
                                    />
                                </div>
                            </div>
                            
                            {/* Filter */}
                            {isFilterVisible && (
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="input-blocks">
                                                    <label>Nhà cung cấp</label>
                                                    <Select 
                                                        options={supplierOptions} 
                                                        className="select" 
                                                        placeholder="Chọn nhà cung cấp"
                                                        value={supplierOptions.find(opt => opt.value === filters.supplierId)}
                                                        onChange={(option) => handleFilterChange('supplierId', option.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="input-blocks">
                                                    <label>Trạng thái</label>
                                                    <Select 
                                                        options={statusOptions} 
                                                        className="select" 
                                                        placeholder="Chọn trạng thái"
                                                        value={statusOptions.find(opt => opt.value === filters.statusId)}
                                                        onChange={(option) => handleFilterChange('statusId', option.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="input-blocks">
                                                    <label>Kho</label>
                                                    <Select 
                                                        options={warehouseOptions} 
                                                        className="select" 
                                                        placeholder="Chọn kho"
                                                        value={warehouseOptions.find(opt => opt.value === filters.warehouseId)}
                                                        onChange={(option) => handleFilterChange('warehouseId', option.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-sm-6 col-12">
                                                <div className="input-blocks">
                                                    <label>&nbsp;</label>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-filters" onClick={handleSearch}>
                                                            <i className="feather-search me-1" />
                                                            Tìm kiếm
                                                        </button>
                                                        <button className="btn btn-secondary" onClick={handleReset}>
                                                            Đặt lại
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Data Table */}
                            <div className="table-responsive">
                                <Table
                                    className="table datanew"
                                    columns={columns}
                                    dataSource={purchaseOrders}
                                    loading={loading}
                                    pagination={{
                                        current: pagination.currentPage + 1,
                                        pageSize: pagination.pageSize,
                                        total: pagination.totalElements,
                                        showSizeChanger: true,
                                        showQuickJumper: true,
                                        showTotal: (total, range) =>
                                            `${range[0]}-${range[1]} của ${total} đơn hàng`,
                                    }}
                                    onChange={handlePageChange}
                                    rowKey={(record) => record.purchaseOrderId}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddPurchases />
            <ImportPurchases />
            <EditPurchases />
        </div>
    )
}

export default PurchasesList