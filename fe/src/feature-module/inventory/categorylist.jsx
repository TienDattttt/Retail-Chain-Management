import React, { useState, useEffect } from 'react'
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { Link } from 'react-router-dom';
import { Edit, Filter, PlusCircle, Sliders, StopCircle, Trash2 } from 'feather-icons-react/build/IconComponents';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { DatePicker } from 'antd';
import AddCategoryList from '../../core/modals/inventory/addcategorylist';
import EditCategoryList from '../../core/modals/inventory/editcategorylist';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Table from '../../core/pagination/datatable';
import { 
  fetchCategories, 
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
  selectCategories,
  selectProductsLoading,
  selectProductsError,
  clearError
} from '../../core/redux/productSlice';
import { formatDate } from '../../core/utils/helpers';

const CategoryList = () => {

    const dispatch = useDispatch();
    
    // Category data from Redux
    const categories = useSelector(selectCategories);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    
    // Filter categories based on search and status
    const filteredCategories = categories.filter(category => {
        const matchesSearch = !searchTerm || 
            category.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesStatus = !statusFilter || 
            (statusFilter === 'active' && !category.isDeleted) ||
            (statusFilter === 'inactive' && category.isDeleted);
            
        return matchesSearch && matchesStatus;
    });
    
    // Calculate pagination
    const totalItems = filteredCategories.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);
    
    const toggleFilterVisibility = () => {
        setIsFilterVisible((prevVisibility) => !prevVisibility);
    };
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Load categories on component mount
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Handle add category
    const handleAddCategory = () => {
        console.log('Add category button clicked');
        setSelectedCategory(null);
        setShowAddModal(true);
        console.log('showAddModal set to true');
    };

    // Handle edit category
    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setShowEditModal(true);
    };

    // Handle toggle status
    const handleToggleStatus = async (categoryId, isDeleted) => {
        try {
            await dispatch(toggleCategoryStatus({ categoryId, isDeleted })).unwrap();
            
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: 'Thành công!',
                text: `Danh mục đã được ${isDeleted ? 'vô hiệu hóa' : 'kích hoạt'}.`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Failed to toggle category status:', error);
            
            const MySwal = withReactContent(Swal);
            MySwal.fire('Lỗi!', 'Không thể cập nhật trạng thái danh mục.', 'error');
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handle delete category
    const handleDeleteCategory = async (categoryId) => {
        const MySwal = withReactContent(Swal);
        
        const result = await MySwal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa danh mục này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteCategory(categoryId)).unwrap();
                MySwal.fire('Đã xóa!', 'Danh mục đã được xóa thành công.', 'success');
            } catch (error) {
                MySwal.fire('Lỗi!', 'Không thể xóa danh mục.', 'error');
            }
        }
    };


    const sortOptions = [
        { value: 'name', label: 'Sắp xếp theo tên' },
        { value: 'date', label: 'Sắp xếp theo ngày tạo' },
        { value: 'newest', label: 'Mới nhất' },
        { value: 'oldest', label: 'Cũ nhất' },
    ];
    
    const statusOptions = [
        { value: '', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
    ];



    const columns = [
        {
            title: "Tên danh mục",
            dataIndex: "categoryName",
            render: (text, record) => (
                <span className="productimgname">
                    <Link to="#" className="product-img">
                        <ImageWithBasePath 
                            alt={record.categoryName} 
                            src={record.imageUrl || "assets/img/categories/category-01.png"} 
                        />
                    </Link>
                    <Link to="#">{text}</Link>
                </span>
            ),
            sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
        },

        {
            title: "Mô tả",
            dataIndex: "description",
            render: (text) => text || "Chưa có mô tả",
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdDate",
            render: (date) => formatDate(date),
            sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
        },
        {
            title: "Trạng thái",
            dataIndex: "isDeleted",
            render: (isDeleted, record) => (
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`status-${record.id}`}
                        checked={!isDeleted}
                        onChange={(e) => handleToggleStatus(record.id, !e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={`status-${record.id}`}>
                        {!isDeleted ? 'Hoạt động' : 'Không hoạt động'}
                    </label>
                </div>
            ),
            sorter: (a, b) => a.isDeleted - b.isDeleted,
        },
        {
            title: 'Thao tác',
            dataIndex: 'actions',
            render: (_, record) => (
                <div className="action-table-data">
                    <div className="edit-delete-action">
                        <button
                            className="me-2 p-2 btn btn-link"
                            onClick={() => handleEditCategory(record)}
                            style={{ border: 'none', background: 'none' }}
                        >
                            <Edit className="feather-edit" />
                        </button>
                        <button
                            className="confirm-text p-2 btn btn-link"
                            onClick={() => handleDeleteCategory(record.id)}
                            style={{ border: 'none', background: 'none' }}
                        >
                            <Trash2 className="feather-trash-2" />
                        </button>
                    </div>
                </div>
            )
        },
    ]
    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>Danh mục</h4>
                            </div>
                        </div>

                        <div className="page-btn">
                            <button
                                className="btn btn-added"
                                onClick={handleAddCategory}
                            >
                                <PlusCircle className="me-2" />
                                Thêm danh mục mới
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
                                            placeholder="Tìm kiếm danh mục..."
                                            className="form-control form-control-sm formsearch"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(0); // Reset to first page when searching
                                            }}
                                        />
                                        <button className="btn btn-searchset" type="button">
                                            <i data-feather="search" className="feather-search" />
                                        </button>
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
                                        placeholder="Sắp xếp"
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
                                                <StopCircle className="info-img" />
                                                <Select
                                                    options={statusOptions}
                                                    className="select"
                                                    placeholder="Chọn trạng thái"
                                                    value={statusOptions.find(opt => opt.value === statusFilter)}
                                                    onChange={(option) => {
                                                        setStatusFilter(option ? option.value : '');
                                                        setCurrentPage(0); // Reset to first page when filtering
                                                    }}
                                                    isClearable
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <i data-feather="calendar" className="info-img" />
                                                <div className="input-groupicon">
                                                    <DatePicker
                                                        selected={selectedDate}
                                                        onChange={handleDateChange}
                                                        type="date"
                                                        className="filterdatepicker"
                                                        dateFormat="dd-MM-yyyy"
                                                        placeholder='Choose Date'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <button 
                                                    className="btn btn-filters ms-auto"
                                                    onClick={() => {
                                                        setSearchTerm('');
                                                        setStatusFilter('');
                                                        setCurrentPage(0);
                                                    }}
                                                >
                                                    <i data-feather="refresh-cw" className="feather-refresh-cw" />
                                                    Đặt lại
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                                            <div className="input-blocks">
                                                <Link className="btn btn-filters ms-auto">
                                                    {" "}
                                                    <i data-feather="search" className="feather-search" />{" "}
                                                    Search{" "}
                                                </Link>
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
                                    dataSource={paginatedCategories} 
                                    loading={loading === 'loading'}
                                    rowKey="id"
                                    pagination={false}
                                />
                            </div>
                            
                            {/* Custom Pagination */}
                            {totalPages > 1 && (
                              <div className="d-flex justify-content-between align-items-center mt-3">
                                <div className="dataTables_info">
                                  Hiển thị {startIndex + 1} đến {Math.min(endIndex, totalItems)} của {totalItems} danh mục
                                </div>
                                <div className="dataTables_paginate">
                                  <ul className="pagination">
                                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                      <button 
                                        className="page-link" 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 0}
                                      >
                                        Trước
                                      </button>
                                    </li>
                                    
                                    {/* Page numbers */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                      let pageNum;
                                      if (totalPages <= 5) {
                                        pageNum = i;
                                      } else if (currentPage < 3) {
                                        pageNum = i;
                                      } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 5 + i;
                                      } else {
                                        pageNum = currentPage - 2 + i;
                                      }
                                      
                                      return (
                                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                          <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(pageNum)}
                                          >
                                            {pageNum + 1}
                                          </button>
                                        </li>
                                      );
                                    })}
                                    
                                    <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
                                      <button 
                                        className="page-link" 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= totalPages - 1}
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
                </div>
            </div>
            <AddCategoryList 
                show={showAddModal}
                onHide={() => {
                    setShowAddModal(false);
                }}
                onSubmit={(categoryData) => {
                    dispatch(createCategory(categoryData));
                    setShowAddModal(false);
                }}
            />
            <EditCategoryList 
                show={showEditModal}
                onHide={() => {
                    setShowEditModal(false);
                    setSelectedCategory(null);
                }}
                category={selectedCategory}
                onSubmit={(categoryData) => {
                    dispatch(updateCategory(categoryData));
                    setShowEditModal(false);
                    setSelectedCategory(null);
                }}
            />
        </div>
    )
}

export default CategoryList
