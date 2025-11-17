import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { message, Spin } from 'antd';
import { X } from 'feather-icons-react/build/IconComponents';
import { stockTransferService } from '../../api/stockTransferService';

const XemChiTietPhieuXuat = ({ transferId, isVisible, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [transferDetail, setTransferDetail] = useState(null);

    useEffect(() => {
        if (isVisible && transferId) {
            loadTransferDetail();
        }
    }, [isVisible, transferId]);

    const loadTransferDetail = async () => {
        setLoading(true);
        try {
            const data = await stockTransferService.getTransferDetail(transferId);
            setTransferDetail(data);
        } catch (error) {
            message.error('Không thể tải chi tiết phiếu xuất kho');
            console.error('Error loading transfer detail:', error);
        } finally {
            setLoading(false);
        }
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
                            <h4>Chi Tiết Phiếu Xuất Kho</h4>
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
                                <p className="mt-3">Đang tải chi tiết phiếu xuất kho...</p>
                            </div>
                        ) : transferDetail ? (
                            <div className="transfer-detail-content">
                                {/* Header thông tin phiếu xuất */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header bg-primary text-white">
                                                <h6 className="mb-0">Thông Tin Phiếu Xuất</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row mb-2">
                                                    <div className="col-5"><strong>Mã phiếu:</strong></div>
                                                    <div className="col-7">
                                                        <span className="badge bg-primary fs-6">
                                                            {transferDetail.transferCode || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-5"><strong>Ngày xuất:</strong></div>
                                                    <div className="col-7">{formatDate(transferDetail.transferDate)}</div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-5"><strong>Ngày tạo:</strong></div>
                                                    <div className="col-7">{formatDate(transferDetail.createdDate)}</div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header bg-success text-white">
                                                <h6 className="mb-0">Thông Tin Kho & Chi Nhánh</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row mb-2">
                                                    <div className="col-4"><strong>Kho xuất:</strong></div>
                                                    <div className="col-8">{transferDetail.fromWarehouseName || 'N/A'}</div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-4"><strong>Chi nhánh nhận:</strong></div>
                                                    <div className="col-8">{transferDetail.toBranchName || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mô tả phiếu xuất */}
                                {transferDetail.description && (
                                    <div className="row mb-4">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="card-header bg-info text-white">
                                                    <h6 className="mb-0">Ghi Chú</h6>
                                                </div>
                                                <div className="card-body">
                                                    <p className="mb-0">{transferDetail.description}</p>
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
                                                                <th>Đơn vị</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {transferDetail.items && transferDetail.items.length > 0 ? (
                                                                transferDetail.items.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>
                                                                            <span className="badge bg-secondary">
                                                                                {item.productCode || 'N/A'}
                                                                            </span>
                                                                        </td>
                                                                        <td><strong>{item.productName || 'N/A'}</strong></td>
                                                                        <td>
                                                                            <span className="badge bg-primary">
                                                                                {item.quantity || 0}
                                                                            </span>
                                                                        </td>
                                                                        <td>{item.unit || 'N/A'}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="5" className="text-center text-muted py-4">
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
                                                    <div className="col-6"><strong>Tổng sản phẩm:</strong></div>
                                                    <div className="col-6 text-end">
                                                        <span className="badge bg-info">
                                                            {transferDetail.items?.length || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-6"><strong>Tổng số lượng:</strong></div>
                                                    <div className="col-6 text-end">
                                                        <span className="badge bg-primary">
                                                            {transferDetail.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <p className="text-muted">Không thể tải chi tiết phiếu xuất kho</p>
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
                        {transferDetail && (
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

XemChiTietPhieuXuat.propTypes = {
    transferId: PropTypes.number,
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

XemChiTietPhieuXuat.defaultProps = {
    transferId: null,
};

export default XemChiTietPhieuXuat;