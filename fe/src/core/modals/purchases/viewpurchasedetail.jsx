import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import { X } from 'feather-icons-react/build/IconComponents';
import PropTypes from 'prop-types';
import { purchaseService } from '../../api/purchaseService';

const XemChiTietPhieuNhap = ({ purchaseOrderId, isVisible, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [purchaseDetail, setPurchaseDetail] = useState(null);

    useEffect(() => {
        if (isVisible && purchaseOrderId) {
            loadPurchaseDetail();
        }
    }, [isVisible, purchaseOrderId]);

    const loadPurchaseDetail = async () => {
        setLoading(true);
        try {
            const data = await purchaseService.getPrintData(purchaseOrderId);
            setPurchaseDetail(data);
        } catch (error) {
            message.error('Không thể tải chi tiết phiếu nhập hàng');
            console.error('Error loading purchase detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return amount?.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }) || '0 ₫';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (!isVisible) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <div className="page-title">
                            <h4>Chi Tiết Phiếu Nhập Hàng</h4>
                        </div>
                        <button
                            type="button"
                            className="close"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="modal-body">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spin size="large" />
                                <p className="mt-3">Đang tải chi tiết phiếu nhập hàng...</p>
                            </div>
                        ) : purchaseDetail ? (
                            <div className="purchase-detail-content">
                                {/* Header thông tin đơn hàng */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header bg-primary text-white">
                                                <h6 className="mb-0">Thông Tin Đơn Hàng</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row mb-2">
                                                    <div className="col-5"><strong>Mã đơn hàng:</strong></div>
                                                    <div className="col-7">
                                                        <span className="badge bg-primary fs-6">
                                                            {purchaseDetail.purchaseOrderCode || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-5"><strong>Ngày nhập:</strong></div>
                                                    <div className="col-7">{formatDate(purchaseDetail.purchaseDate)}</div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-5"><strong>Ngày giao dự kiến:</strong></div>
                                                    <div className="col-7">{formatDate(purchaseDetail.expectedDeliveryDate)}</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-5"><strong>Ngày giao thực tế:</strong></div>
                                                    <div className="col-7">{formatDate(purchaseDetail.deliveryDate)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header bg-success text-white">
                                                <h6 className="mb-0">Thông Tin Nhà Cung Cấp</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row mb-2">
                                                    <div className="col-4"><strong>Tên:</strong></div>
                                                    <div className="col-8">{purchaseDetail.supplier?.name || 'N/A'}</div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-4"><strong>Điện thoại:</strong></div>
                                                    <div className="col-8">{purchaseDetail.supplier?.phone || 'N/A'}</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-4"><strong>Địa chỉ:</strong></div>
                                                    <div className="col-8">{purchaseDetail.supplier?.address || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mô tả đơn hàng */}
                                {purchaseDetail.description && (
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="card-header bg-info text-white">
                                                    <h6 className="mb-0">Ghi Chú</h6>
                                                </div>
                                                <div className="card-body">
                                                    <p className="mb-0">{purchaseDetail.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Danh sách sản phẩm */}
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header bg-warning text-dark">
                                                <h6 className="mb-0">Danh Sách Sản Phẩm</h6>
                                            </div>
                                            <div className="card-body p-0">
                                                <div className="table-responsive">
                                                    <table className="table table-striped mb-0">
                                                        <thead className="table-dark">
                                                            <tr>
                                                                <th>STT</th>
                                                                <th>Mã sản phẩm</th>
                                                                <th>Tên sản phẩm</th>
                                                                <th>Số lượng</th>
                                                                <th>Đơn giá</th>
                                                                <th>Ngày hết hạn</th>
                                                                <th>Thành tiền</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {purchaseDetail.items && purchaseDetail.items.length > 0 ? (
                                                                purchaseDetail.items.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>
                                                                            <span className="badge bg-secondary">
                                                                                {item.productId || 'N/A'}
                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            <strong>{item.name || 'N/A'}</strong>
                                                                        </td>
                                                                        <td>
                                                                            <span className="badge bg-primary">
                                                                                {item.quantity || 0}
                                                                            </span>
                                                                        </td>
                                                                        <td>{formatCurrency(item.unitPrice)}</td>
                                                                        <td>{formatDate(item.expiredDate)}</td>
                                                                        <td>
                                                                            <strong className="text-success">
                                                                                {formatCurrency(item.total)}
                                                                            </strong>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="7" className="text-center text-muted py-4">
                                                                        Không có sản phẩm nào
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tổng kết */}
                                <div className="row">
                                    <div className="col-md-8"></div>
                                    <div className="col-md-4">
                                        <div className="card">
                                            <div className="card-header bg-dark text-white">
                                                <h6 className="mb-0">Tổng Kết</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row mb-2">
                                                    <div className="col-6"><strong>Tổng tiền hàng:</strong></div>
                                                    <div className="col-6 text-end">
                                                        {formatCurrency(purchaseDetail.totalPayment)}
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-6">Giảm giá:</div>
                                                    <div className="col-6 text-end text-danger">
                                                        -{formatCurrency(purchaseDetail.discount)}
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-6">
                                                        <strong className="text-primary">Tổng thanh toán:</strong>
                                                    </div>
                                                    <div className="col-6 text-end">
                                                        <strong className="text-primary fs-5">
                                                            {formatCurrency(purchaseDetail.totalPayment)}
                                                        </strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <p className="text-muted">Không thể tải chi tiết phiếu nhập hàng</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                        {purchaseDetail && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => window.print()}
                            >
                                In phiếu
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

XemChiTietPhieuNhap.propTypes = {
    purchaseOrderId: PropTypes.number,
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

XemChiTietPhieuNhap.defaultProps = {
    purchaseOrderId: null,
};

export default XemChiTietPhieuNhap;