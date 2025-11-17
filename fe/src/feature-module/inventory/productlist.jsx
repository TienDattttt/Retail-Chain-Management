import {
  Box,
  Edit,
  Eye,
  Filter,
  GitMerge,
  PlusCircle,
  Sliders,
  StopCircle,
  Trash2,
} from "feather-icons-react/build/IconComponents";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import ProductModal from "../../core/modals/inventory/ProductModal";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";

import Table from "../../core/pagination/datatable";


import { 
  fetchProducts, 
  fetchProductsPaged,
  searchProductsPaged,
  fetchCategories, 
  updateProduct,
  selectProducts,
  selectCategories,
  selectProductsLoading,
  selectProductsError,
  selectProductsPagination,
  clearError
} from "../../core/redux/productSlice";
import { formatCurrency, formatDate } from "../../core/utils/helpers";

const ProductList = () => {
  const dispatch = useDispatch();

  
  // Product data from Redux
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const pagination = useSelector(selectProductsPagination);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortDir] = useState('asc'); // Removed setSortDir since we're not using it yet
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  // Load products with pagination
  const loadProducts = useCallback((page = 0) => {
    if (searchTerm.trim()) {
      dispatch(searchProductsPaged({
        keyword: searchTerm,
        page,
        size: 10,
        sortBy,
        sortDir
      }));
    } else {
      dispatch(fetchProductsPaged({
        page,
        size: 10,
        sortBy,
        sortDir
      }));
    }
  }, [dispatch, searchTerm, sortBy, sortDir]);

  // Load data on component mount
  useEffect(() => {
    loadProducts();
    dispatch(fetchCategories());
  }, [dispatch, loadProducts]);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    // Reset to first page when searching
    if (value.trim()) {
      dispatch(searchProductsPaged({
        keyword: value,
        page: 0,
        size: 10,
        sortBy,
        sortDir
      }));
    } else {
      dispatch(fetchProductsPaged({
        page: 0,
        size: 10,
        sortBy,
        sortDir
      }));
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    loadProducts(newPage);
  };

  // Handle sort change
  const handleSort = (selectedOption) => {
    if (selectedOption) {
      setSortBy(selectedOption.value);
      // Reset to first page when sorting changes
      if (searchTerm.trim()) {
        dispatch(searchProductsPaged({
          keyword: searchTerm,
          page: 0,
          size: 10,
          sortBy: selectedOption.value,
          sortDir
        }));
      } else {
        dispatch(fetchProductsPaged({
          page: 0,
          size: 10,
          sortBy: selectedOption.value,
          sortDir
        }));
      }
    }
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };





  // Handle add new product
  const handleAddProduct = () => {
    console.log('Add product button clicked');
    setSelectedProduct(null);
    setIsEditMode(false);
    setShowProductModal(true);
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    console.log('Edit product button clicked:', product);
    setSelectedProduct(product);
    setIsEditMode(true);
    setShowProductModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
    setIsEditMode(false);
    // Refresh products after modal closes
    loadProducts(pagination.page);
  };

  // Handle toggle product status
  const handleToggleStatus = async (productId, isActive) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      // Create updated product with new status
      const updatedProduct = {
        id: product.id,
        code: product.code,
        name: product.name,
        categoryId: product.categoryId,
        basePrice: product.basePrice,
        retailPrice: product.retailPrice,
        weight: product.weight,
        unit: product.unit,
        allowsSale: product.allowsSale,
        description: product.description,
        barcode: product.barcode,
        imageUrl: product.imageUrl,
        // Update status based on toggle
        statusCode: isActive ? 'ACTIVE' : 'INACTIVE',
        // Keep other fields
        attributes: product.attributes,
        autoGenerateBarcode: product.autoGenerateBarcode
      };

      await dispatch(updateProduct(updatedProduct)).unwrap();
      
      // Show success message
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Thành công!',
        text: `Sản phẩm đã được ${isActive ? 'kích hoạt' : 'vô hiệu hóa'}.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error('Failed to toggle product status:', error);
      
      // Show error message
      const MySwal = withReactContent(Swal);
      MySwal.fire('Lỗi!', 'Không thể cập nhật trạng thái sản phẩm.', 'error');
      
      // Refresh data to revert UI
      dispatch(fetchProducts());
    }
  };

  // Handle delete product (soft delete)
  const handleDeleteProduct = async (productId) => {
    const MySwal = withReactContent(Swal);
    
    const result = await MySwal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const deletedProduct = {
          ...product,
          statusId: 30, // Assuming 30 = DELETED
          statusCode: 'DELETED'
        };

        await dispatch(updateProduct(deletedProduct)).unwrap();
        MySwal.fire('Đã xóa!', 'Sản phẩm đã được xóa thành công.', 'success');
      } catch (error) {
        MySwal.fire('Lỗi!', 'Không thể xóa sản phẩm.', 'error');
      }
    }
  };
  const route = all_routes;
  
  // Convert categories to select options
  const categoryOptions = [
    { value: "", label: "Tất cả danh mục" },
    ...categories.map(cat => ({
      value: cat.id,
      label: cat.categoryName
    }))
  ];

  const sortOptions = [
    { value: "name", label: "Sắp xếp theo tên" },
    { value: "retailPrice", label: "Sắp xếp theo giá" },
    { value: "createdDate", label: "Sắp xếp theo ngày tạo" },
    { value: "code", label: "Sắp xếp theo mã" },
  ];

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "Active", label: "Đang hoạt động" },
    { value: "Inactive", label: "Không hoạt động" },
  ];

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      render: (text, record) => {
        console.log('Product record:', record.id, 'imageUrl:', record.imageUrl);
        return (
          <span className="productimgname">
            <Link to={`${route.productdetails}/${record.id}`} className="product-img stock-img">
              <ImageWithBasePath 
                alt={record.name} 
                src={record.imageUrl || "assets/img/products/stock-img-01.png"} 
              />
            </Link>
            <Link to={`${route.productdetails}/${record.id}`}>{text}</Link>
          </span>
        );
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },

    {
      title: "Barcode",
      dataIndex: "barcode",
      render: (text) => text || "Chưa có",
      sorter: (a, b) => (a.barcode || "").localeCompare(b.barcode || ""),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryId",
      render: (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.categoryName : "Chưa phân loại";
      },
      sorter: (a, b) => {
        const catA = categories.find(cat => cat.id === a.categoryId)?.categoryName || "";
        const catB = categories.find(cat => cat.id === b.categoryId)?.categoryName || "";
        return catA.localeCompare(catB);
      },
    },
    {
      title: "Giá bán",
      dataIndex: "retailPrice",
      render: (price) => formatCurrency(price),
      sorter: (a, b) => (a.retailPrice || 0) - (b.retailPrice || 0),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      render: (text) => text || "Cái",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusCode",
      render: (statusCode, record) => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`status-${record.id}`}
            checked={statusCode === 'ACTIVE'}
            onChange={(e) => handleToggleStatus(record.id, e.target.checked)}
          />
          <label className="form-check-label" htmlFor={`status-${record.id}`}>
            {statusCode === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
          </label>
        </div>
      ),
      sorter: (a, b) => a.statusCode.localeCompare(b.statusCode),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link className="me-2 p-2" to={`${route.productdetails}/${record.id}`}>
              <Eye className="feather-view" />
            </Link>
            <button
              className="me-2 p-2 btn btn-link"
              onClick={() => handleEditProduct(record)}
              style={{ border: 'none', background: 'none' }}
            >
              <Edit className="feather-edit" />
            </button>
            <button
              className="confirm-text p-2 btn btn-link"
              onClick={() => handleDeleteProduct(record.id)}
              style={{ border: 'none', background: 'none' }}
            >
              <Trash2 className="feather-trash-2" />
            </button>
          </div>
        </div>
      ),
    },
  ];


  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Danh sách sản phẩm</h4>
            </div>
          </div>

          <div className="page-btn">
            <button 
              className="btn btn-added"
              onClick={handleAddProduct}
            >
              <PlusCircle className="me-2 iconsize" />
              Thêm mới sản phẩm
            </button>
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
                    placeholder="Tìm kiếm sản phẩm..."
                    className="form-control form-control-sm formsearch"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <button className="btn btn-searchset" type="button">
                    <i data-feather="search" className="feather-search" />
                  </button>
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
              <div className="form-sort">
                <Sliders className="info-img" />
                <Select
                  className="select"
                  options={sortOptions}
                  placeholder="Sắp xếp"
                  value={sortBy}
                  onChange={handleSort}
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
                  <div className="col-lg-12 col-sm-12">
                    <div className="row">
                      <div className="col-lg-3 col-sm-6 col-12">
                        <div className="input-blocks">
                          <StopCircle className="info-img" />
                          <Select
                            className="select"
                            options={categoryOptions}
                            placeholder="Chọn danh mục"
                            value={selectedCategory}
                            onChange={handleCategoryFilter}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6 col-12">
                        <div className="input-blocks">
                          <Box className="info-img" />
                          <Select
                            className="select"
                            options={statusOptions}
                            placeholder="Chọn trạng thái"
                            value={selectedStatus}
                            onChange={handleStatusFilter}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6 col-12">
                        <div className="input-blocks">
                          <GitMerge className="info-img" />
                          <Select
                            className="select"
                            options={sortOptions}
                            placeholder="Sắp xếp theo"
                            value={sortBy}
                            onChange={handleSort}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6 col-12">
                        <div className="input-blocks">
                          <button 
                            className="btn btn-filters ms-auto" 
                            type="button"
                            onClick={() => {
                              setSelectedCategory(null);
                              setSelectedStatus(null);
                              setSortBy(null);
                              setSearchTerm('');
                            }}
                          >
                            <i
                              data-feather="refresh-cw"
                              className="feather-refresh-cw"
                            />
                            Đặt lại
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Filter */}
            
            {/* Error Display */}
            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Lỗi!</strong> {error}
                <button 
                  type="button" 
                  className="btn-close ms-2" 
                  onClick={() => dispatch(clearError())}
                  aria-label="Close"
                ></button>
              </div>
            )}
            
            <div className="table-responsive">
              <Table 
                columns={columns} 
                dataSource={products} 
                loading={loading === 'loading'}
                rowKey="id"
                pagination={false}
              />
            </div>
            
            {/* Custom Pagination */}
            {pagination.total > pagination.size && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="dataTables_info">
                  Hiển thị {pagination.page * pagination.size + 1} đến {Math.min((pagination.page + 1) * pagination.size, pagination.total)} của {pagination.total} sản phẩm
                </div>
                <div className="dataTables_paginate">
                  <ul className="pagination">
                    <li className={`page-item ${pagination.page === 0 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 0}
                      >
                        Trước
                      </button>
                    </li>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i;
                      } else if (pagination.page < 3) {
                        pageNum = i;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 5 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <li key={pageNum} className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum + 1}
                          </button>
                        </li>
                      );
                    })}
                    
                    <li className={`page-item ${pagination.page >= pagination.totalPages - 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages - 1}
                      >
                        Sau
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* /product list */}
        <Brand />
        
        {/* Product Modal */}
        <ProductModal
          show={showProductModal}
          onHide={handleCloseModal}
          product={selectedProduct}
          isEdit={isEditMode}
        />
      </div>
    </div>
  );
};

export default ProductList;
