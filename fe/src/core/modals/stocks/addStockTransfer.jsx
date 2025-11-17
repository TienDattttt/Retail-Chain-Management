import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import Select from 'react-select';
import { X, Trash2, Search } from 'feather-icons-react/build/IconComponents';
import { useDispatch, useSelector } from 'react-redux';
import { createStockTransfer } from '../../redux/stockTransferSlice';
import { fetchBranches, selectBranches } from '../../redux/branchSlice';
import { fetchProductsWithStock, selectProducts } from '../../redux/productSlice';

const ThemPhieuXuatKho = ({ isVisible, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const branches = useSelector(selectBranches);
    const products = useSelector(selectProducts);
    
    const [formData, setFormData] = useState({
        fromWarehouseId: 1, // Mặc định kho tổng
        toBranchId: null,
        description: '',
        createdBy: 1, // Sẽ lấy từ user session sau
        items: []
    });
    
    const [loading, setLoading] = useState(false);
    const [searchProduct, setSearchProduct] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (isVisible) {
            dispatch(fetchBranches());
            // Lấy sản phẩm với thông tin tồn kho từ kho tổng (warehouseId = 1)
            dispatch(fetchProductsWithStock({ warehouseId: formData.fromWarehouseId }));
            resetForm();
        }
    }, [isVisible, dispatch]);

    // Cập nhật danh sách sản phẩm khi thay đổi kho xuất
    useEffect(() => {
        if (isVisible && formData.fromWarehouseId) {
            dispatch(fetchProductsWithStock({ warehouseId: formData.fromWarehouseId }));
        }
    }, [formData.fromWarehouseId, isVisible, dispatch]);

    useEffect(() => {
        if (searchProduct) {
            const filtered = products.filter(product => 
                product.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
                product.code.toLowerCase().includes(searchProduct.toLowerCase())
            );
            setFilteredProducts(filtered.slice(0, 10)); // Giới hạn 10 kết quả
        } else {
            setFilteredProducts([]);
        }
    }, [searchProduct, products]);

    const resetForm = () => {
        setFormData({
            fromWarehouseId: 1,
            toBranchId: null,
            description: '',
            createdBy: 1,
            items: []
        });
        setSearchProduct('');
        setFilteredProducts([]);
    };

    const warehouseOptions = [
        { value: 1, label: 'Kho Tổng' }
    ];

    const branchOptions = branches.map(branch => ({
        value: branch.id,
        label: branch.name
    }));

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addProductToList = (product) => {
        const existingItem = formData.items.find(item => item.productId === product.id);
        
        if (existingItem) {
            message.warning('Sản phẩm đã có trong danh sách');
            return;
        }

        const newItem = {
            productId: product.id,
            productName: product.name,
            productCode: product.code,
            quantity: 1,
            availableStock: product.availableStock || 0
        };

        setFormData(prev => ({
            ...prev,
            items: [...prev.items, newItem]
        }));
        
        setSearchProduct('');
        setFilteredProducts([]);
    };

    const updateItemQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }

        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => 
                item.productId === productId 
                    ? { ...item, quantity: parseInt(quantity) || 1 }
                    : item
            )
        }));
    };

    const removeItem = (productId) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.productId !== productId)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.toBranchId) {
            message.error('Vui lòng chọn chi nhánh nhận');
            return;
        }

        if (formData.items.length === 0) {
            message.error('Vui lòng thêm ít nhất một sản phẩm');
            return;
        }

        // Kiểm tra số lượng
        const invalidItems = formData.items.filter(item => 
            item.quantity > item.availableStock
        );
        
        if (invalidItems.length > 0) {
            message.error('Số lượng xuất không được vượt quá tồn kho');
            return;
        }

        setLoading(true);
        
        try {
            const transferData = {
                fromWarehouseId: formData.fromWarehouseId,
                toBranchId: formData.toBranchId,
                description: formData.description,
                createdBy: formData.createdBy,
                items: formData.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            };

            const result = await dispatch(createStockTransfer(transferData)).unwrap();
            
            message.success(`Tạo phiếu xuất kho thành công! Mã phiếu: ${result.transferCode}`);
            
            if (onSuccess) {
                onSuccess();
            }
            
            onClose();
        } catch (error) {
            message.error(error || 'Có lỗi xảy ra khi tạo phiếu xuất kho');
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <div className="page-title">
                            <h4>Tạo Phiếu Xuất Kho</h4>
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
                    
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                {/* Thông tin cơ bản */}
                                <div className="col-lg-6">
                                    <div className="input-blocks">
                                        <label>Kho xuất <span className="text-danger">*</span></label>
                                        <Select
                                            className="select"
                                            options={warehouseOptions}
                                            value={warehouseOptions.find(opt => opt.value === formData.fromWarehouseId)}
                                            onChange={(selected) => handleInputChange('fromWarehouseId', selected?.value)}
                                            placeholder="Chọn kho xuất"
                                        />
                                    </div>
                                </div>
                                
                                <div className="col-lg-6">
                                    <div className="input-blocks">
                                        <label>Chi nhánh nhận <span className="text-danger">*</span></label>
                                        <Select
                                            className="select"
                                            options={branchOptions}
                                            value={branchOptions.find(opt => opt.value === formData.toBranchId)}
                                            onChange={(selected) => handleInputChange('toBranchId', selected?.value)}
                                            placeholder="Chọn chi nhánh nhận"
                                        />
                                    </div>
                                </div>

                                {/* Tìm kiếm sản phẩm */}
                                <div className="col-lg-12">
                                    <div className="input-blocks">
                                        <label>Tìm kiếm sản phẩm</label>
                                        <div className="position-relative">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập tên hoặc mã sản phẩm..."
                                                value={searchProduct}
                                                onChange={(e) => setSearchProduct(e.target.value)}
                                            />
                                            <Search className="position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} size={16} />
                                        </div>
                                        
                                        {/* Dropdown kết quả tìm kiếm */}
                                        {filteredProducts.length > 0 && (
                                            <div className="search-results mt-2" style={{ 
                                                maxHeight: '200px', 
                                                overflowY: 'auto',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                backgroundColor: 'white'
                                            }}>
                                                {filteredProducts.map(product => (
                                                    <div
                                                        key={product.id}
                                                        className="search-result-item p-2 border-bottom"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => addProductToList(product)}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                                    >
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                <strong>{product.name}</strong>
                                                                <br />
                                                                <small className="text-muted">Mã: {product.code}</small>
                                                            </div>
                                                            <div className="text-end">
                                                                <small className="text-success">
                                                                    Tồn kho: {product.availableStock || 0}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Danh sách sản phẩm đã chọn */}
                                {formData.items.length > 0 && (
                                    <div className="col-lg-12">
                                        <div className="input-blocks">
                                            <label>Danh sách sản phẩm xuất kho</label>
                                            <div className="table-responsive">
                                                <table className="table table-bordered">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Mã SP</th>
                                                            <th>Tên sản phẩm</th>
                                                            <th>Tồn kho</th>
                                                            <th>Số lượng xuất</th>
                                                            <th>Thao tác</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formData.items.map(item => (
                                                            <tr key={item.productId}>
                                                                <td>
                                                                    <span className="badge bg-secondary">
                                                                        {item.productCode}
                                                                    </span>
                                                                </td>
                                                                <td>{item.productName}</td>
                                                                <td>
                                                                    <span className="badge bg-info">
                                                                        {item.availableStock}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        style={{ width: '100px' }}
                                                                        min="1"
                                                                        max={item.availableStock}
                                                                        value={item.quantity}
                                                                        onChange={(e) => updateItemQuantity(item.productId, e.target.value)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => removeItem(item.productId)}
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Ghi chú */}
                                <div className="col-lg-12">
                                    <div className="input-blocks">
                                        <label>Ghi chú</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Nhập ghi chú cho phiếu xuất kho..."
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || formData.items.length === 0}
                            >
                                {loading ? 'Đang tạo...' : 'Tạo phiếu xuất kho'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

ThemPhieuXuatKho.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};

ThemPhieuXuatKho.defaultProps = {
    onSuccess: null,
};

export default ThemPhieuXuatKho;