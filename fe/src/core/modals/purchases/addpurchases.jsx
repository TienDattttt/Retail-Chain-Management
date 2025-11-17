import React, { useState, useEffect } from 'react'
import { message } from 'antd';
import { PlusCircle, Trash2 } from 'feather-icons-react/build/IconComponents';
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux';
import { processPurchaseOrder } from '../../redux/purchaseSlice';
import { fetchSuppliers, selectSuppliers } from '../../redux/supplierSlice';
import { fetchProducts, selectProducts } from '../../redux/productSlice';

const ThemDonNhapHang = () => {
    const dispatch = useDispatch();
    const suppliers = useSelector(selectSuppliers);
    const products = useSelector(selectProducts);

    // Form state
    const [formData, setFormData] = useState({
        supplierId: null,
        expectedDeliveryDate: null,
        deliveryDate: null,
        description: '',
        total: 0,
        totalPayment: 0,
        discount: 0,
        discountRatio: 0,
        createdBy: 1, // Hardcode for now
        items: []
    });

    const [currentItem, setCurrentItem] = useState({
        productId: null,
        quantity: 1,
        unitPrice: 0,
        expiredDate: null
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchSuppliers());
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        tinhToanTong();
    }, [formData.items, formData.discount]);

    // Options for selects
    const nhaCungCapOptions = [
        { value: null, label: 'Chọn nhà cung cấp' },
        ...suppliers.map(supplier => ({
            value: supplier.id,
            label: supplier.name
        }))
    ];

    const sanPhamOptions = [
        { value: null, label: 'Chọn sản phẩm' },
        ...products.map(product => ({
            value: product.id,
            label: `${product.name} - ${product.code}`
        }))
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleItemChange = (field, value) => {
        setCurrentItem(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const themSanPham = () => {
        if (!currentItem.productId || currentItem.quantity <= 0 || currentItem.unitPrice <= 0) {
            message.error('Vui lòng điền đầy đủ thông tin sản phẩm');
            return;
        }

        const existingIndex = formData.items.findIndex(item => item.productId === currentItem.productId);
        
        if (existingIndex >= 0) {
            // Update existing item
            const updatedItems = [...formData.items];
            updatedItems[existingIndex] = { ...currentItem };
            setFormData(prev => ({ ...prev, items: updatedItems }));
        } else {
            // Add new item
            setFormData(prev => ({
                ...prev,
                items: [...prev.items, { ...currentItem }]
            }));
        }

        // Reset current item
        setCurrentItem({
            productId: null,
            quantity: 1,
            unitPrice: 0,
            expiredDate: null
        });

        // Recalculate totals
        setTimeout(() => tinhToanTong(), 100);
    };

    const xoaSanPham = (index) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, items: updatedItems }));
        setTimeout(() => tinhToanTong(), 100);
    };

    const tinhToanTong = () => {
        setFormData(prev => {
            const total = prev.items.reduce((sum, item) => {
                return sum + (item.quantity * item.unitPrice);
            }, 0);
            
            const totalAfterDiscount = total - prev.discount;
            
            return {
                ...prev,
                total: total,
                totalPayment: totalAfterDiscount
            };
        });
    };

    const handleSubmit = async () => {
        if (!formData.supplierId) {
            message.error('Vui lòng chọn nhà cung cấp');
            return;
        }

        if (formData.items.length === 0) {
            message.error('Vui lòng thêm ít nhất một sản phẩm');
            return;
        }

        setLoading(true);
        try {
            // Clean data before sending
            const cleanedData = {
                ...formData,
                expectedDeliveryDate: formData.expectedDeliveryDate || null,
                deliveryDate: formData.deliveryDate || null,
                description: formData.description || '',
                items: formData.items.map(item => ({
                    ...item,
                    expiredDate: item.expiredDate || null
                }))
            };
            
            const result = await dispatch(processPurchaseOrder(cleanedData)).unwrap();
            message.success(`Tạo đơn nhập hàng thành công! Mã đơn: ${result.purchaseOrderCode}`);
            
            // Reset form
            setFormData({
                supplierId: null,
                expectedDeliveryDate: null,
                deliveryDate: null,
                description: '',
                total: 0,
                totalPayment: 0,
                discount: 0,
                discountRatio: 0,
                createdBy: 1,
                items: []
            });
            
            setCurrentItem({
                productId: null,
                quantity: 1,
                unitPrice: 0,
                expiredDate: null
            });
            
            // Close modal
            document.querySelector('[data-bs-dismiss="modal"]').click();
            
            // Reload purchase orders list
            window.location.reload();
        } catch (error) {
            message.error('Có lỗi xảy ra khi tạo đơn nhập hàng: ' + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    const layTenSanPham = (productId) => {
        const product = products.find(p => p.id === productId);
        return product ? product.name : 'N/A';
    };

    return (
        <div>
            {/* Add Purchase */}
            <div className="modal fade" id="add-units">
                <div className="modal-dialog purchase modal-dialog-centered stock-adjust-modal">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>Thêm Đơn Nhập Hàng</h4>
                                    </div>
                                    <button
                                        type="button"
                                        className="close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body custom-modal-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="input-blocks">
                                                    <label>Nhà cung cấp *</label>
                                                    <Select 
                                                        options={nhaCungCapOptions} 
                                                        className="select" 
                                                        placeholder="Chọn nhà cung cấp"
                                                        value={nhaCungCapOptions.find(opt => opt.value === formData.supplierId)}
                                                        onChange={(selected) => handleInputChange('supplierId', selected?.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                <div className="input-blocks">
                                                    <label>Ngày giao hàng dự kiến</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={formData.expectedDeliveryDate || ''}
                                                        onChange={(e) => handleInputChange('expectedDeliveryDate', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                <div className="input-blocks">
                                                    <label>Ngày giao hàng thực tế</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={formData.deliveryDate || ''}
                                                        onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Thêm sản phẩm */}
                                        <div className="row border-top pt-3">
                                            <div className="col-lg-12">
                                                <h6 className="mb-3">Thêm sản phẩm vào đơn hàng</h6>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-12">
                                                <div className="input-blocks">
                                                    <label>Sản phẩm *</label>
                                                    <Select 
                                                        options={sanPhamOptions} 
                                                        className="select" 
                                                        placeholder="Chọn sản phẩm"
                                                        value={sanPhamOptions.find(opt => opt.value === currentItem.productId)}
                                                        onChange={(selected) => handleItemChange('productId', selected?.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="input-blocks">
                                                    <label>Số lượng *</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        min="1"
                                                        value={currentItem.quantity}
                                                        onChange={(e) => handleItemChange('quantity', parseInt(e.target.value) || 0)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-2 col-md-6 col-sm-12">
                                                <div className="input-blocks">
                                                    <label>Đơn giá *</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        min="0"
                                                        step="0.01"
                                                        value={currentItem.unitPrice}
                                                        onChange={(e) => handleItemChange('unitPrice', parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-12">
                                                <div className="input-blocks">
                                                    <label>Ngày hết hạn</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={currentItem.expiredDate || ''}
                                                        onChange={(e) => handleItemChange('expiredDate', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-1 col-md-6 col-sm-12">
                                                <div className="input-blocks">
                                                    <label>&nbsp;</label>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary w-100"
                                                        onClick={themSanPham}
                                                    >
                                                        <PlusCircle size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Danh sách sản phẩm đã thêm */}
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="modal-body-table">
                                                    <div className="table-responsive">
                                                        <table className="table datanew">
                                                            <thead>
                                                                <tr>
                                                                    <th>Sản phẩm</th>
                                                                    <th>Số lượng</th>
                                                                    <th>Đơn giá</th>
                                                                    <th>Ngày hết hạn</th>
                                                                    <th>Thành tiền</th>
                                                                    <th>Thao tác</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {formData.items.length === 0 ? (
                                                                    <tr>
                                                                        <td colSpan="6" className="text-center text-muted">
                                                                            Chưa có sản phẩm nào được thêm
                                                                        </td>
                                                                    </tr>
                                                                ) : (
                                                                    formData.items.map((item, index) => (
                                                                        <tr key={index}>
                                                                            <td>{layTenSanPham(item.productId)}</td>
                                                                            <td>{item.quantity}</td>
                                                                            <td>{item.unitPrice?.toLocaleString('vi-VN')} ₫</td>
                                                                            <td>{item.expiredDate || 'Không có'}</td>
                                                                            <td className="text-success fw-bold">
                                                                                {(item.quantity * item.unitPrice)?.toLocaleString('vi-VN')} ₫
                                                                            </td>
                                                                            <td>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-sm btn-danger"
                                                                                    onClick={() => xoaSanPham(index)}
                                                                                >
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Tổng kết đơn hàng */}
                                        <div className="row border-top pt-3">
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="input-blocks">
                                                    <label>Giảm giá</label>
                                                    <input 
                                                        type="number" 
                                                        className="form-control"
                                                        min="0"
                                                        step="0.01"
                                                        value={formData.discount}
                                                        onChange={(e) => {
                                                            const discount = parseFloat(e.target.value) || 0;
                                                            handleInputChange('discount', discount);
                                                            setTimeout(() => tinhToanTong(), 100);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="input-blocks">
                                                    <label>Ghi chú</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="3"
                                                        placeholder="Nhập ghi chú cho đơn hàng..."
                                                        value={formData.description}
                                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hiển thị tổng tiền */}
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card bg-light">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <strong>Tổng tiền hàng:</strong>
                                                            </div>
                                                            <div className="col-6 text-end">
                                                                <strong>{formData.totalPayment?.toLocaleString('vi-VN')} ₫</strong>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-6">
                                                                Giảm giá:
                                                            </div>
                                                            <div className="col-6 text-end">
                                                                -{formData.discount?.toLocaleString('vi-VN')} ₫
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <strong className="text-primary">Tổng thanh toán:</strong>
                                                            </div>
                                                            <div className="col-6 text-end">
                                                                <strong className="text-primary fs-5">
                                                                    {formData.totalPayment?.toLocaleString('vi-VN')} ₫
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="modal-footer-btn">
                                                <button
                                                    type="button"
                                                    className="btn btn-cancel me-2"
                                                    data-bs-dismiss="modal"
                                                >
                                                    Hủy
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-submit"
                                                    onClick={handleSubmit}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Đang xử lý...' : 'Tạo đơn hàng'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Purchase */}
        </div>
    )
}

export default ThemDonNhapHang
