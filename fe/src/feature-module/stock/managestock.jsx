import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import Breadcrumbs from "../../core/breadcrumbs";
import { Filter, Sliders } from "react-feather";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Select from "react-select";
import { Link } from "react-router-dom";
import ManageStockModal from "../../core/modals/stocks/managestockModal";
import { Edit, Trash2 } from "react-feather";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Table from "../../core/pagination/datatable";
import {
  fetchStockManagement,
  setFilters,
  setPagination,
  resetFilters,
  selectStockData,
  selectStockLoading,
  selectStockError,
  selectStockPagination,
  selectStockFilters,
} from "../../core/redux/stockSlice";
import { fetchBranches, selectBranches } from "../../core/redux/branchSlice";
import { fetchCategories, selectCategories } from "../../core/redux/productSlice";

const Managestock = () => {
  const dispatch = useDispatch();
  const stockData = useSelector(selectStockData);
  const loading = useSelector(selectStockLoading);
  const error = useSelector(selectStockError);
  const pagination = useSelector(selectStockPagination);
  const filters = useSelector(selectStockFilters);
  const branches = useSelector(selectBranches);
  const categories = useSelector(selectCategories);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchCategories());
  }, [dispatch]);

  const loadStockData = React.useCallback(() => {
    const searchParams = {
      ...filters,
      page: pagination.currentPage,
      size: pagination.pageSize,
    };
    dispatch(fetchStockManagement(searchParams));
  }, [dispatch, filters, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    loadStockData();
  }, [loadStockData]);

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
    { value: "productName", label: "Tên sản phẩm" },
    { value: "productCode", label: "Mã sản phẩm" },
    { value: "categoryName", label: "Danh mục" },
    { value: "available", label: "Số lượng có thể bán" },
    { value: "branchName", label: "Vị trí" },
  ];

  const locationOptions = [
    { value: null, label: "Kho tổng công ty" },
    ...branches.map(branch => ({
      value: branch.id,
      label: branch.name
    }))
  ];

  const categoryOptions = [
    { value: null, label: "Tất cả danh mục" },
    ...categories.map(category => ({
      value: category.categoryId,
      label: category.categoryName
    }))
  ];

  const stockStatusOptions = [
    { value: "ALL", label: "Tất cả" },
    { value: "NORMAL", label: "Bình thường" },
    { value: "LOW_STOCK", label: "Sắp hết" },
    { value: "OUT_OF_STOCK", label: "Hết hàng" },
  ];

  const getStockStatusBadge = (status) => {
    switch (status) {
      case "OUT_OF_STOCK":
        return <span className="badge badge-linesuccess">Hết hàng</span>;
      case "LOW_STOCK":
        return <span className="badge badge-linedanger">Sắp hết</span>;
      default:
        return <span className="badge badge-linesuccess">Bình thường</span>;
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      render: (text, record) => (
        <span className="userimgname">
          <Link to="#" className="product-img">
            <ImageWithBasePath 
              alt="img" 
              src={record.imageUrl || "assets/img/products/noimage.png"} 
            />
          </Link>
          <div>
            <Link to="#">{record.productName}</Link>
            <div className="text-muted small">{record.productCode}</div>
          </div>
        </span>
      ),
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      render: (text) => text || "-",
      sorter: (a, b) => (a.categoryName || "").localeCompare(b.categoryName || ""),
    },
    {
      title: "Vị trí",
      dataIndex: "branchName",
      render: (text) => text || "Kho tổng công ty",
      sorter: (a, b) => (a.branchName || "").localeCompare(b.branchName || ""),
    },
    {
      title: "Tồn kho",
      dataIndex: "onHand",
      render: (text) => (
        <div className="text-center">
          <strong>{text || 0}</strong>
        </div>
      ),
      sorter: (a, b) => (a.onHand || 0) - (b.onHand || 0),
    },
    {
      title: "Đã đặt",
      dataIndex: "reserved",
      render: (text) => (
        <div className="text-center">
          {text || 0}
        </div>
      ),
      sorter: (a, b) => (a.reserved || 0) - (b.reserved || 0),
    },
    {
      title: "Có thể bán",
      dataIndex: "available",
      render: (text, record) => (
        <div className="text-center">
          <strong className={text === 0 ? "text-danger" : text <= (record.minThreshold || 0) ? "text-warning" : "text-success"}>
            {text || 0}
          </strong>
          {record.minThreshold && (
            <div className="text-muted small">
              Tối thiểu: {record.minThreshold}
            </div>
          )}
        </div>
      ),
      sorter: (a, b) => (a.available || 0) - (b.available || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "stockStatus",
      render: (status) => getStockStatusBadge(status),
    },
    {
      title: "Giá bán",
      dataIndex: "retailPrice",
      render: (price) => (
        <div className="text-end">
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(price || 0)}
        </div>
      ),
      sorter: (a, b) => (a.retailPrice || 0) - (b.retailPrice || 0),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      render: () => (
        <div className="edit-delete-action">
          <Link
            className="me-2 p-2"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#edit-units"
          >
            <Edit className="feather-edit" />
          </Link>
          <Link
            className="confirm-text p-2"
            to="#"
            onClick={showConfirmationAlert}
          >
            <Trash2 className="feather-trash-2" />
          </Link>
        </div>
      ),
    },
  ];

  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          className: "btn btn-success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      } else {
        MySwal.close();
      }
    });
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Quản lý tồn kho"
          subtitle="Theo dõi và quản lý tồn kho sản phẩm"
        />
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
                  options={sortOptions}
                  placeholder="Sắp xếp theo"
                  value={sortOptions.find(opt => opt.value === filters.sortBy)}
                  onChange={(option) => handleFilterChange('sortBy', option.value)}
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
                      <label>Vị trí</label>
                      <Select
                        className="select"
                        options={locationOptions}
                        placeholder="Chọn vị trí"
                        value={locationOptions.find(opt => opt.value === filters.branchId)}
                        onChange={(option) => handleFilterChange('branchId', option.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <label>Danh mục</label>
                      <Select
                        className="select"
                        options={categoryOptions}
                        placeholder="Chọn danh mục"
                        value={categoryOptions.find(opt => opt.value === filters.categoryId)}
                        onChange={(option) => handleFilterChange('categoryId', option.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <div className="input-blocks">
                      <label>Trạng thái tồn kho</label>
                      <Select
                        className="select"
                        options={stockStatusOptions}
                        placeholder="Chọn trạng thái"
                        value={stockStatusOptions.find(opt => opt.value === filters.stockStatus)}
                        onChange={(option) => handleFilterChange('stockStatus', option.value)}
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
            {/* /Filter */}
            <div className="table-responsive">
              <Table
                className="table datanew"
                columns={columns}
                dataSource={stockData}
                loading={loading}
                pagination={{
                  current: pagination.currentPage + 1,
                  pageSize: pagination.pageSize,
                  total: pagination.totalElements,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} sản phẩm`,
                }}
                onChange={handlePageChange}
                rowKey={(record) => `${record.productId}-${record.branchId || 0}`}
              />
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
      <ManageStockModal />
    </div>
  );
};

export default Managestock;
