import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { 
  createProduct, 
  updateProduct, 
  uploadProductImage,
  selectCategories,
  selectProductsLoading,
  selectProductsError,
  clearError
} from '../../redux/productSlice';
import ImageWithBasePath from '../../img/imagewithbasebath';

const ProductModal = ({ 
  show, 
  onHide, 
  product = null, 
  isEdit = false 
}) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  // Form state
  const [formData, setFormData] = useState({
    id: null,
    code: '',
    name: '',
    categoryId: null,
    basePrice: '',
    retailPrice: '',
    weight: '',
    unit: 'Cái',
    allowsSale: true,
    status: 'Active',
    description: '',
    barcode: '',
    imageUrl: '',
    autoGenerateBarcode: false,
    attributes: [],
    units: []
  });

  const [units, setUnits] = useState([
    { unitName: 'Cái', conversionRate: 1, isBaseUnit: true }
  ]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [validated, setValidated] = useState(false);



  // Status options
  const statusOptions = [
    { value: 'Active', label: 'Hoạt động' },
    { value: 'Inactive', label: 'Không hoạt động' },
  ];

  // Category options
  const categoryOptions = [
    { value: null, label: 'Chọn danh mục' },
    ...categories.map(cat => ({
      value: cat.id,
      label: cat.categoryName
    }))
  ];

  // Initialize form data when product changes
  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        id: product.id,
        code: product.code || '',
        name: product.name || '',
        categoryId: product.categoryId,
        basePrice: product.basePrice || '',
        retailPrice: product.retailPrice || '',
        weight: product.weight || '',
        unit: product.unit || 'Cái',
        allowsSale: product.allowsSale !== false,
        status: product.status || 'Active',
        description: product.description || '',
        barcode: product.barcode || '',
        imageUrl: product.imageUrl || '',
        autoGenerateBarcode: false,
        attributes: product.attributes || [],
        units: product.units || []
      });
      setUnits(product.units && product.units.length > 0 ? product.units : [
        { unitName: product.unit || 'Cái', conversionRate: 1, isBaseUnit: true }
      ]);
      setImagePreview(product.imageUrl || '');
    } else {
      // Reset form for new product
      setFormData({
        id: null,
        code: '',
        name: '',
        categoryId: null,
        basePrice: '',
        retailPrice: '',
        weight: '',
        unit: 'Cái',
        allowsSale: true,
        status: 'Active',
        description: '',
        barcode: '',
        imageUrl: '',
        autoGenerateBarcode: true,
        attributes: [],
        units: []
      });
      setUnits([
        { unitName: 'Cái', conversionRate: 1, isBaseUnit: true }
      ]);
      setImagePreview('');
    }
    setImageFile(null);
    setValidated(false);
    dispatch(clearError());
  }, [product, isEdit, dispatch]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : null
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle units management
  const handleAddUnit = () => {
    setUnits([...units, { unitName: '', conversionRate: 1, isBaseUnit: false }]);
  };

  const handleRemoveUnit = (index) => {
    if (units.length > 1) {
      const newUnits = units.filter((_, i) => i !== index);
      // If we removed the base unit, make the first one base
      if (units[index].isBaseUnit && newUnits.length > 0) {
        newUnits[0].isBaseUnit = true;
        newUnits[0].conversionRate = 1;
      }
      setUnits(newUnits);
    }
  };

  const handleUnitChange = (index, field, value) => {
    const newUnits = [...units];
    newUnits[index][field] = value;
    
    // If setting as base unit, unset others and set conversion rate to 1
    if (field === 'isBaseUnit' && value) {
      newUnits.forEach((unit, i) => {
        if (i !== index) {
          unit.isBaseUnit = false;
        } else {
          unit.conversionRate = 1;
        }
      });
    }
    
    setUnits(newUnits);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // Prepare data for API
      const productData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice) || 0,
        retailPrice: parseFloat(formData.retailPrice) || 0,
        weight: parseFloat(formData.weight) || null,
        units: units.map(unit => ({
          ...unit,
          conversionRate: parseFloat(unit.conversionRate) || 1
        }))
      };

      let result;
      if (isEdit) {
        result = await dispatch(updateProduct(productData)).unwrap();
      } else {
        result = await dispatch(createProduct(productData)).unwrap();
      }

      // Upload image if selected
      if (imageFile && result.data) {
        await dispatch(uploadProductImage({
          productId: result.data.id,
          file: imageFile
        })).unwrap();
      }

      // Close modal on success
      onHide();
      
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  // Handle modal close
  const handleClose = () => {
    dispatch(clearError());
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Error Alert */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
              <strong>Lỗi!</strong> {error}
            </Alert>
          )}

          <Row>
            {/* Product Image */}
            <Col md={4}>
              <div className="text-center mb-3">
                <div className="product-image-preview mb-3">
                  {imagePreview ? (
                    <ImageWithBasePath
                      src={imagePreview}
                      alt="Product preview"
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                        borderRadius: '8px'
                      }}
                    />
                  ) : (
                    <div 
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        margin: '0 auto'
                      }}
                    >
                      Chưa có ảnh
                    </div>
                  )}
                </div>
                <Form.Group>
                  <Form.Label>Ảnh sản phẩm</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>
              </div>
            </Col>

            {/* Product Details */}
            <Col md={8}>
              <Row>
                <Col md={isEdit ? 6 : 12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên sản phẩm *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập tên sản phẩm"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập tên sản phẩm
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {isEdit && (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mã sản phẩm</Form.Label>
                      <Form.Control
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="Mã sản phẩm"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                )}

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Danh mục</Form.Label>
                    <Select
                      options={categoryOptions}
                      value={categoryOptions.find(opt => opt.value === formData.categoryId)}
                      onChange={(option) => handleSelectChange('categoryId', option)}
                      placeholder="Chọn danh mục"
                      isClearable
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Đơn vị</Form.Label>
                    <Form.Control
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      placeholder="Nhập đơn vị (VD: Cái, Kg, Lít...)"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giá gốc</Form.Label>
                    <Form.Control
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giá bán *</Form.Label>
                    <Form.Control
                      type="number"
                      name="retailPrice"
                      value={formData.retailPrice}
                      onChange={handleInputChange}
                      required
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập giá bán
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Trọng lượng (kg)</Form.Label>
                    <Form.Control
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.001"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Barcode</Form.Label>
                    <Form.Control
                      type="text"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      placeholder="Nhập barcode hoặc để trống để tự sinh"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Trạng thái</Form.Label>
                    <Select
                      options={statusOptions}
                      value={statusOptions.find(opt => opt.value === formData.status)}
                      onChange={(option) => handleSelectChange('status', option)}
                      placeholder="Chọn trạng thái"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="allowsSale"
                      checked={formData.allowsSale}
                      onChange={handleInputChange}
                      label="Cho phép bán"
                    />
                  </Form.Group>
                </Col>

                {/* Units Management */}
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Form.Label>Đơn vị sản phẩm</Form.Label>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={handleAddUnit}
                      >
                        + Thêm đơn vị
                      </Button>
                    </div>
                    
                    {units.map((unit, index) => (
                      <Row key={index} className="mb-2 align-items-end">
                        <Col md={4}>
                          <Form.Control
                            type="text"
                            placeholder="Tên đơn vị (VD: Lon, Thùng)"
                            value={unit.unitName}
                            onChange={(e) => handleUnitChange(index, 'unitName', e.target.value)}
                            required
                          />
                        </Col>
                        <Col md={3}>
                          <Form.Control
                            type="number"
                            placeholder="Tỷ lệ chuyển đổi"
                            value={unit.conversionRate}
                            onChange={(e) => handleUnitChange(index, 'conversionRate', parseFloat(e.target.value) || 1)}
                            min="0.001"
                            step="0.001"
                            disabled={unit.isBaseUnit}
                          />
                        </Col>
                        <Col md={3}>
                          <Form.Check
                            type="checkbox"
                            label="Đơn vị cơ bản"
                            checked={unit.isBaseUnit}
                            onChange={(e) => handleUnitChange(index, 'isBaseUnit', e.target.checked)}
                          />
                        </Col>
                        <Col md={2}>
                          {units.length > 1 && (
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleRemoveUnit(index)}
                            >
                              Xóa
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ))}
                    
                    <small className="text-muted">
                      * Đơn vị cơ bản có tỷ lệ chuyển đổi = 1. VD: 1 Thùng = 24 Lon thì Lon là đơn vị cơ bản (1), Thùng có tỷ lệ 24.
                    </small>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Nhập mô tả sản phẩm"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={loading === 'loading'}
          >
            {loading === 'loading' ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Đang lưu...
              </>
            ) : (
              isEdit ? 'Cập nhật' : 'Thêm mới'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

ProductModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  product: PropTypes.object,
  isEdit: PropTypes.bool
};

export default ProductModal;