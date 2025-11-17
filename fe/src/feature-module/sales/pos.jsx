import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ImageWithBasePath from '../../core/img/imagewithbasebath'
import { RotateCw } from 'feather-icons-react/build/IconComponents'
import { Check, CheckCircle, MoreVertical, Trash2, UserPlus } from 'react-feather'
import Select from 'react-select'
import PlusCircle from 'feather-icons-react/build/IconComponents/PlusCircle'
import MinusCircle from 'feather-icons-react/build/IconComponents/MinusCircle'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Redux imports
import {
  fetchCustomers,
  fetchProductsByBranch,
  fetchCategories,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  setSelectedCustomer,
  setSelectedCategory,
  setPaymentMethod,
  clearCart,
  processSale,
  clearSaleResult
} from '../../core/redux/salesSlice';
import { selectUser } from '../../core/redux/authSlice';

const Pos = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const user = useSelector(selectUser);
  const {
    customers,
    products,
    categories,
    cart,
    selectedCustomer,
    selectedCategory,
    total,
    paymentMethod,
    loading,
    saleResult
  } = useSelector(state => state.sales);

  // Local state
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Handle MoMo return parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const orderId = urlParams.get('orderId');
    const message = urlParams.get('message');

    if (paymentStatus) {
      const MySwal = withReactContent(Swal);
      
      if (paymentStatus === 'success') {
        MySwal.fire({
          title: 'Thanh toán thành công!',
          text: `Đơn hàng ${orderId} đã được thanh toán qua MoMo`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Clear cart after successful payment
          dispatch(clearCart());
          // Remove URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      } else if (paymentStatus === 'failed') {
        MySwal.fire({
          title: 'Thanh toán thất bại!',
          text: message || 'Có lỗi xảy ra trong quá trình thanh toán',
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(() => {
          // Remove URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      } else if (paymentStatus === 'error') {
        MySwal.fire({
          title: 'Lỗi hệ thống!',
          text: 'Có lỗi xảy ra, vui lòng thử lại',
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(() => {
          // Remove URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      }
    }
  }, [dispatch]);

  // Load data on component mount
  useEffect(() => {
    if (user) {
      dispatch(fetchCustomers());
      dispatch(fetchCategories());
      
      // Nếu user có branch thì lấy sản phẩm theo branch, không thì lấy tất cả
      if (user.branch && user.branch.id) {
        dispatch(fetchProductsByBranch(user.branch.id));
      } else {
        // Fallback: lấy sản phẩm của branch đầu tiên hoặc tất cả sản phẩm
        dispatch(fetchProductsByBranch(1)); // Giả sử branch ID 1 tồn tại
      }
    }
  }, [dispatch, user]);

  // Filter products by category
  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter(product => 
        product.category && product.category.id === selectedCategory.id
      ));
    } else {
      setFilteredProducts(products);
    }
  }, [products, selectedCategory]);

  // Handle quantity changes
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
    }
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  // Handle remove from cart
  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    dispatch(setSelectedCustomer(customer));
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    dispatch(setSelectedCategory(category));
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    dispatch(setPaymentMethod(method));
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (cart.length === 0) {
      MySwal.fire({
        title: 'Giỏ hàng trống',
        text: 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!user || !user.branch || !user.branch.id) {
      MySwal.fire({
        title: 'Lỗi',
        text: 'Không thể xác định chi nhánh. Vui lòng đăng nhập lại.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const saleData = {
      branchId: user.branch.id,
      customerId: selectedCustomer?.id || null,
      total: total,
      totalPayment: total,
      discount: 0,
      discountRatio: 0,
      description: '',
      paymentMethod: paymentMethod,
      createdBy: user.userId,
      details: cart.map(item => ({
        product: { id: item.product.id },
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0
      }))
    };

    try {
      const result = await dispatch(processSale(saleData)).unwrap();
      
      // Nếu thanh toán bằng MoMo và có payUrl, chuyển hướng đến link thanh toán
      if (paymentMethod === 'MOMO' && result.payUrl) {
        // Chuyển hướng trực tiếp đến trang thanh toán MoMo
        window.location.href = result.payUrl;
        return;
      } else {
        // Thanh toán tiền mặt hoặc không có payUrl, hiển thị modal thành công
        setShowPaymentModal(true);
      }
    } catch (error) {
      MySwal.fire({
        title: 'Lỗi thanh toán',
        text: error.message || 'Có lỗi xảy ra khi xử lý thanh toán.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Handle reset cart
  const handleResetCart = () => {
    dispatch(clearCart());
  };

  // Convert data for select components
  const customerOptions = customers.map(customer => ({
    value: customer.id,
    label: customer.name,
    data: customer
  }));

  // SweetAlert setup
  const MySwal = withReactContent(Swal);

  const settings = {
    dots: false,
    autoplay: false,
    slidesToShow: 5,
    margin: 0,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };



  return (
    <div>
      <div className="page-wrapper pos-pg-wrapper ms-0">
        <div className="content pos-design p-0">
          <div className="btn-row d-sm-flex align-items-center">
            <Link to="#" className="btn btn-info" onClick={(e) => {
              e.preventDefault();
              handleResetCart();
            }}>
              <span className="me-1 d-flex align-items-center">
                <RotateCw className="feather-16" />
              </span>
              Reset
            </Link>
          </div>
          <div className="row align-items-start pos-wrapper">
            <div className="col-md-12 col-lg-8">
              <div className="pos-categories tabs_wrapper">
         
                <Slider {...settings} className='tabs owl-carousel pos-category'>
                  {/* All Categories */}
                  <div 
                    className={`pos-slick-item ${!selectedCategory ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Link to="#" onClick={(e) => e.preventDefault()}>
                      <ImageWithBasePath src="assets/img/categories/category-01.png" alt="Categories" />
                    </Link>
                    <h6>
                      <Link to="#" onClick={(e) => e.preventDefault()}>Tất cả</Link>
                    </h6>
                    <span>{products.length} Sản phẩm</span>
                  </div>
                  
                  {/* Dynamic Categories */}
                  {categories.map((category) => (
                    <div 
                      key={category.id}
                      className={`pos-slick-item ${selectedCategory?.id === category.id ? 'active' : ''}`}
                      onClick={() => handleCategorySelect(category)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Link to="#" onClick={(e) => e.preventDefault()}>
                        <ImageWithBasePath 
                          src={category.imageUrl || "assets/img/categories/category-02.png"} 
                          alt={category.name} 
                        />
                      </Link>
                      <h6>
                        <Link to="#" onClick={(e) => e.preventDefault()}>{category.name}</Link>
                      </h6>
                      <span>
                        {products.filter(p => p.category && p.category.id === category.id).length} Sản phẩm
                      </span>
                    </div>
                  ))}
                </Slider>
                <div className="pos-products">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-3">Products</h5>
                  </div>
                  <div className="tabs_container">
                    <div className="tab_content active">
                      <div className="row">
                        {loading ? (
                          <div className="col-12 text-center">
                            <div className="spinner-border" role="status">
                              <span className="sr-only">Đang tải...</span>
                            </div>
                          </div>
                        ) : filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <div key={product.id} className="col-sm-2 col-md-6 col-lg-3 col-xl-3">
                              <div className="product-info default-cover card">
                                <Link 
                                  to="#" 
                                  className="img-bg"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(product);
                                  }}
                                >
                                  <ImageWithBasePath
                                    src={product.imageUrl || "assets/img/products/pos-product-01.png"}
                                    alt={product.name}
                                  />
                                  <span>
                                    <Check className="feather-16"/>
                                  </span>
                                </Link>
                                <h6 className="cat-name">
                                  <Link to="#" onClick={(e) => e.preventDefault()}>
                                    {product.category?.name || 'Không có danh mục'}
                                  </Link>
                                </h6>
                                <h6 className="product-name">
                                  <Link 
                                    to="#" 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleAddToCart(product);
                                    }}
                                  >
                                    {product.name}
                                  </Link>
                                </h6>
                                <div className="d-flex align-items-center justify-content-between price">
                                  <span>{product.code}</span>
                                  <p>{product.retailPrice?.toLocaleString('vi-VN')}đ</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-12 text-center">
                            <p>Không có sản phẩm nào</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-4 ps-0">
              <aside className="product-order-list">
                <div className="head d-flex align-items-center justify-content-between w-100">
                  <div className="">
                    <h5>Order List</h5>
                    <span>Transaction ID : #65565</span>
                  </div>
                  <div className="">
                    <Link className="confirm-text" to="#">
                      <Trash2 className="feather-16 text-danger me-1" />
                    </Link>
                    <Link to="#" className="text-default">
                      <MoreVertical className="feather-16" />
                    </Link>
                  </div>
                </div>
                <div className="customer-info block-section">
                  <h6>Thông tin khách hàng</h6>
                  <div className="input-block d-flex align-items-center">
                    <div className="flex-grow-1">
                      <Select
                        options={[
                          { value: null, label: 'Khách lẻ' },
                          ...customerOptions
                        ]}
                        className="select"
                        placeholder="Chọn khách hàng"
                        value={selectedCustomer ? 
                          { value: selectedCustomer.id, label: selectedCustomer.name } : 
                          { value: null, label: 'Khách lẻ' }
                        }
                        onChange={(option) => {
                          if (option.value) {
                            const customer = customers.find(c => c.id === option.value);
                            handleCustomerSelect(customer);
                          } else {
                            handleCustomerSelect(null);
                          }
                        }}
                      />
                    </div>
                    <Link
                      to="#"
                      className="btn btn-primary btn-icon"
                      data-bs-toggle="modal"
                      data-bs-target="#create"
                    >
                      <UserPlus className="feather-16" />
                    </Link>
                  </div>
                </div>
                <div className="product-added block-section">
                  <div className="head-text d-flex align-items-center justify-content-between">
                    <h6 className="d-flex align-items-center mb-0">
                      Sản phẩm đã thêm<span className="count">{cart.length}</span>
                    </h6>
                    <Link
                      to="#"
                      className="d-flex align-items-center text-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        handleResetCart();
                      }}
                    >
                      <span className="me-1">
                        <i data-feather="x" className="feather-16" />
                      </span>
                      Xóa tất cả
                    </Link>
                  </div>
                  <div className="product-wrap">
                    {cart.length === 0 ? (
                      <div className="text-center py-4">
                        <p>Giỏ hàng trống</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.product.id} className="product-list d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center product-info">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src={item.product.imageUrl || "assets/img/products/pos-product-16.png"}
                                alt={item.product.name}
                              />
                            </Link>
                            <div className="info">
                              <span>{item.product.code}</span>
                              <h6>
                                <Link to="#" onClick={(e) => e.preventDefault()}>
                                  {item.product.name}
                                </Link>
                              </h6>
                              <p>{item.unitPrice?.toLocaleString('vi-VN')}đ</p>
                            </div>
                          </div>
                          <div className="qty-item text-center">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id="tooltip-minus">Giảm</Tooltip>}
                            >
                              <Link
                                to="#"
                                className="dec d-flex justify-content-center align-items-center"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleQuantityChange(item.product.id, item.quantity - 1);
                                }}
                              >
                                <MinusCircle className="feather-14" />
                              </Link>
                            </OverlayTrigger>

                            <input
                              type="text"
                              className="form-control text-center"
                              name="qty"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 0;
                                handleQuantityChange(item.product.id, newQty);
                              }}
                            />
                            
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id="tooltip-plus">Tăng</Tooltip>}
                            >
                              <Link
                                to="#"
                                className="inc d-flex justify-content-center align-items-center"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleQuantityChange(item.product.id, item.quantity + 1);
                                }}
                              >
                                <PlusCircle className="feather-14" />
                              </Link>
                            </OverlayTrigger>
                          </div>
                          <div className="d-flex align-items-center action">
                            <Link
                              className="btn-icon delete-icon confirm-text"
                              to="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveFromCart(item.product.id);
                              }}
                            >
                              <Trash2 className="feather-14" />
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="block-section">
                  <div className="order-total">
                    <table className="table table-responsive table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Tổng cộng</strong></td>
                          <td className="text-end"><strong>{total.toLocaleString('vi-VN')}đ</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="block-section payment-method">
                  <h6>Phương thức thanh toán</h6>
                  <div className="row d-flex align-items-center justify-content-center methods">
                    <div className="col-md-6 col-lg-4 item">
                      <div className={`default-cover ${paymentMethod === 'CASH' ? 'active' : ''}`}>
                        <Link 
                          to="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePaymentMethodSelect('CASH');
                          }}
                        >
                          <ImageWithBasePath
                            src="assets/img/icons/cash-pay.svg"
                            alt="Payment Method"
                          />
                          <span>Tiền mặt</span>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4 item">
                      <div className={`default-cover ${paymentMethod === 'MOMO' ? 'active' : ''}`}>
                        <Link 
                          to="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePaymentMethodSelect('MOMO');
                          }}
                        >
                          <ImageWithBasePath
                            src="assets/img/icons/qr-scan.svg"
                            alt="Payment Method"
                          />
                          <span>MoMo</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-grid btn-block">
                  <Link className="btn btn-secondary" to="#" onClick={(e) => e.preventDefault()}>
                    Tổng cộng: {total.toLocaleString('vi-VN')}đ
                  </Link>
                </div>
                <div className="btn-row d-sm-flex align-items-center justify-content-between">
                  <Link
                    to="#"
                    className="btn btn-danger btn-icon flex-fill"
                    onClick={(e) => {
                      e.preventDefault();
                      handleResetCart();
                    }}
                  >
                    <span className="me-1 d-flex align-items-center">
                      <i data-feather="trash-2" className="feather-16" />
                    </span>
                    Hủy
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-success btn-icon flex-fill"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCheckout();
                    }}
                    disabled={loading || cart.length === 0}
                  >
                    <span className="me-1 d-flex align-items-center">
                      <i data-feather="credit-card" className="feather-16" />
                    </span>
                    {loading ? 'Đang xử lý...' : 'Thanh toán'}
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Completed Modal */}
      <div
        className={`modal fade modal-default ${showPaymentModal ? 'show' : ''}`}
        id="payment-completed"
        aria-labelledby="payment-completed"
        style={{ display: showPaymentModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <form>
                <div className="icon-head">
                  <Link to="#" onClick={(e) => e.preventDefault()}>
                    <CheckCircle className="feather-40" />
                  </Link>
                </div>
                <h4>Thanh toán thành công</h4>
                {saleResult && (
                  <div className="mb-3">
                    <p><strong>Mã hóa đơn:</strong> {saleResult.invoiceCode}</p>
                    <p><strong>Tổng tiền:</strong> {total.toLocaleString('vi-VN')}đ</p>
                    <p><strong>Phương thức:</strong> {paymentMethod === 'CASH' ? 'Tiền mặt' : 'MoMo'}</p>
                    {paymentMethod === 'MOMO' && (
                      <div className="alert alert-success">
                        <p>Đơn hàng đã được tạo thành công. Vui lòng kiểm tra trạng thái thanh toán MoMo.</p>
                      </div>
                    )}
                  </div>
                )}
                <p className="mb-0">
                  {paymentMethod === 'MOMO' 
                    ? 'Đơn hàng đã được tạo. Bạn có muốn in hóa đơn không?' 
                    : 'Bạn có muốn in hóa đơn cho đơn hàng này không?'
                  }
                </p>
                <div className="modal-footer d-sm-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-primary flex-fill me-1"
                    onClick={() => {
                      // Handle print receipt
                      setShowPaymentModal(false);
                      dispatch(clearSaleResult());
                      handleResetCart();
                    }}
                  >
                    In hóa đơn
                  </button>
                  <button 
                    type="button"
                    className="btn btn-secondary flex-fill"
                    onClick={() => {
                      setShowPaymentModal(false);
                      dispatch(clearSaleResult());
                      handleResetCart();
                    }}
                  >
                    Đơn hàng tiếp theo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showPaymentModal && <div className="modal-backdrop fade show"></div>}

      {/* Create Customer Modal */}
      <div
        className="modal fade"
        id="create"
        tabIndex={-1}
        aria-labelledby="create"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tạo khách hàng mới</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Tên khách hàng</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Email</label>
                      <input type="email" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Số điện thoại</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Địa chỉ</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Hủy
                  </button>
                  <Link to="#" className="btn btn-submit me-2">
                    Lưu
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pos