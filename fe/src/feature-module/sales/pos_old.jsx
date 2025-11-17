import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ImageWithBasePath from '../../core/img/imagewithbasebath'
import { RefreshCcw, RotateCw, ShoppingCart } from 'feather-icons-react/build/IconComponents'
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
      await dispatch(processSale(saleData)).unwrap();
      setShowPaymentModal(true);
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

  // const categoryOptions = categories.map(category => ({
  //   value: category.id,
  //   label: category.name,
  //   data: category
  // }));

  // SweetAlert setup
  const MySwal = withReactContent(Swal);




  const settings = {
    dots: false,
    autoplay: false,
    slidesToShow: 5,
    margin:0,
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
                <h5>Categories</h5>
                <p>Select From Below Categories</p>
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
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-02.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Computer</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">MacBook Pro</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>140 Pcs</span>
                              <p>$1000</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-03.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Watches</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Rolex Tribute V3</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>220 Pcs</span>
                              <p>$6800</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-04.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Shoes</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Red Nike Angelo</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>78 Pcs</span>
                              <p>$7800</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-05.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Headphones</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Airpod 2</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>47 Pcs</span>
                              <p>$5478</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-06.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Shoes</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Blue White OGR</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>54 Pcs</span>
                              <p>$987</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-07.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Laptop</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">IdeaPad Slim 5 Gen 7</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>74 Pcs</span>
                              <p>$1454</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-08.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Headphones</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">SWAGME</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>14 Pcs</span>
                              <p>$6587</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-09.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Watches</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Timex Black SIlver</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>24 Pcs</span>
                              <p>$1457</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-10.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Computer</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Tablet 1.02 inch</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>14 Pcs</span>
                              <p>$4744</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-11.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Watches</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Fossil Pair Of 3 in 1 </Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>40 Pcs</span>
                              <p>$789</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-18.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Shoes</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Green Nike Fe</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>78 Pcs</span>
                              <p>$7847</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab_content" data-tab="headphones">
                      <div className="row">
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-05.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Headphones</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Airpod 2</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>47 Pcs</span>
                              <p>$5478</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-08.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Headphones</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">SWAGME</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>14 Pcs</span>
                              <p>$6587</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab_content" data-tab="shoes">
                      <div className="row">
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-04.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Shoes</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Red Nike Angelo</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>78 Pcs</span>
                              <p>$7800</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-06.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Shoes</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Blue White OGR</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>54 Pcs</span>
                              <p>$987</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-18.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Shoes</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Green Nike Fe</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>78 Pcs</span>
                              <p>$7847</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab_content" data-tab="mobiles">
                      <div className="row">
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-01.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Mobiles</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">IPhone 14 64GB</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>30 Pcs</span>
                              <p>$15800</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-14.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Mobiles</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Iphone 11</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>14 Pcs</span>
                              <p>$3654</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab_content" data-tab="watches">
                      <div className="row">
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-03.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Watches</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Rolex Tribute V3</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>220 Pcs</span>
                              <p>$6800</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-09.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Watches</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Timex Black SIlver</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>24 Pcs</span>
                              <p>$1457</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-11.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Watches</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Fossil Pair Of 3 in 1 </Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>40 Pcs</span>
                              <p>$789</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab_content" data-tab="laptops">
                      <div className="row">
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-02.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Computer</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">MacBook Pro</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>140 Pcs</span>
                              <p>$1000</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-07.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Laptop</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">IdeaPad Slim 5 Gen 7</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>74 Pcs</span>
                              <p>$1454</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-10.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Computer</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Tablet 1.02 inch</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>14 Pcs</span>
                              <p>$4744</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-13.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Laptop</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Yoga Book 9i</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>65 Pcs</span>
                              <p>$4784</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-14.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Laptop</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">IdeaPad Slim 3i</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>47 Pcs</span>
                              <p>$1245</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab_content" data-tab="allcategory">
                      <div className="row">
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-01.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Mobiles</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">IPhone 14 64GB</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>30 Pcs</span>
                              <p>$15800</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-02.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Computer</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">MacBook Pro</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>140 Pcs</span>
                              <p>$1000</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-03.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Watches</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Rolex Tribute V3</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>220 Pcs</span>
                              <p>$6800</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-04.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Shoes</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Red Nike Angelo</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>78 Pcs</span>
                              <p>$7800</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-05.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Headphones</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Airpod 2</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>47 Pcs</span>
                              <p>$5478</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-06.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Shoes</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Blue White OGR</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>54 Pcs</span>
                              <p>$987</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-07.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Laptop</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">IdeaPad Slim 5 Gen 7</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>74 Pcs</span>
                              <p>$1454</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-08.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Headphones</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">SWAGME</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>14 Pcs</span>
                              <p>$6587</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-09.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Watches</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Timex Black SIlver</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>24 Pcs</span>
                              <p>$1457</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-10.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Computer</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Tablet 1.02 inch</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>14 Pcs</span>
                              <p>$4744</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-11.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Watches</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Fossil Pair Of 3 in 1 </Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>40 Pcs</span>
                              <p>$789</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-18.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Shoes</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Green Nike Fe</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>78 Pcs</span>
                              <p>$7847</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab_content" data-tab="headphone">
                      <div className="row">
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-05.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Headphones</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Airpod 2</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>47 Pcs</span>
                              <p>$5478</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-08.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Headphones</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">SWAGME</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>14 Pcs</span>
                              <p>$6587</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab_content" data-tab="shoe">
                      <div className="row">
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-04.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Shoes</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Red Nike Angelo</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>78 Pcs</span>
                              <p>$7800</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-06.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Shoes</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Blue White OGR</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>54 Pcs</span>
                              <p>$987</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-18.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Shoes</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Green Nike Fe</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>78 Pcs</span>
                              <p>$7847</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab_content" data-tab="mobile">
                      <div className="row">
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-01.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Mobiles</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">IPhone 14 64GB</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>30 Pcs</span>
                              <p>$15800</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-14.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Mobiles</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Iphone 11</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>14 Pcs</span>
                              <p>$3654</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab_content" data-tab="watche">
                      <div className="row">
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-03.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Watches</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Rolex Tribute V3</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>220 Pcs</span>
                              <p>$6800</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-09.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Watches</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Timex Black SIlver</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>24 Pcs</span>
                              <p>$1457</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-11.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Watches</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Fossil Pair Of 3 in 1 </Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>40 Pcs</span>
                              <p>$789</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab_content" data-tab="laptop">
                      <div className="row">
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-02.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Computer</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">MacBook Pro</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>140 Pcs</span>
                              <p>$1000</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-07.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Laptop</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">IdeaPad Slim 5 Gen 7</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>74 Pcs</span>
                              <p>$1454</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-10.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Computer</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Tablet 1.02 inch</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>14 Pcs</span>
                              <p>$4744</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-13.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Laptop</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">Yoga Book 9i</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>65 Pcs</span>
                              <p>$4784</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                          <div className="product-info default-cover card">
                            <Link to="#" className="img-bg">
                              <ImageWithBasePath
                                src="assets/img/products/pos-product-14.png"
                                alt="Products"
                              />
                              <span>
                                <Check className="feather-16"/>
                              </span>
                            </Link>
                            <h6 className="cat-name">
                              <Link to="#">Laptop</Link>
                            </h6>
                            <h6 className="product-name">
                              <Link to="#">IdeaPad Slim 3i</Link>
                            </h6>
                            <div className="d-flex align-items-center justify-content-between price">
                              <span>47 Pcs</span>
                              <p>$1245</p>
                            </div>
                          </div>
                        </div>
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

      {/* Payment Completed */}
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
                    {saleResult.payUrl && (
                      <div className="alert alert-info">
                        <p>Vui lòng quét mã QR để thanh toán MoMo</p>
                        <a href={saleResult.payUrl} target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm">
                          Mở link thanh toán
                        </a>
                      </div>
                    )}
                  </div>
                )}
                <p className="mb-0">
                  Bạn có muốn in hóa đơn cho đơn hàng này không?
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
      {/* /Payment Completed */}
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
              <h5 className="modal-title">Create</h5>
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
                      <label>Customer Name</label>
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
                      <label>Phone</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Country</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>City</label>
                      <input type="text" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Address</label>
                      <input type="text" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-submit me-2">
                    Submit
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
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <form>
                <h2 className="text-center p-4">4500.00</h2>
                <div className="input-block">
                  <label>Order Reference</label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue=""
                    placeholder=""
                  />
                </div>
                <p>
                  The current order will be set on hold. You can retreive this order
                  from the pending order button. Providing a reference to it might
                  help you to identify the order more quickly.
                </p>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-primary">
                    Confirm
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Hold */}
      {/* Edit Product */}
      <div
        className="modal fade modal-default pos-modal"
        id="edit-product"
        aria-labelledby="edit-product"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5>Red Nike Laser</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <form>
                <div className="row">
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Product Name <span>*</span>
                      </label>
                      <input type="text" placeholder={45} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Tax Type <span>*</span>
                      </label>
                      <Select
                        className="select"
                        options={tax}
                        placeholder="Select Option"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Tax <span>*</span>
                      </label>
                      <input type="text" placeholder="% 15" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Discount Type <span>*</span>
                      </label>
                      <Select
                        className="select"
                        options={discounttype}
                        placeholder="Select Option"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Discount <span>*</span>
                      </label>
                      <input type="text" placeholder={15} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Sale Unit <span>*</span>
                      </label>
                      <Select
                        className="select"
                        options={units}
                        placeholder="Select Option"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-primary">
                    Submit
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Product */}
      {/* Recent Transactions */}
      <div
        className="modal fade pos-modal"
        id="recents"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5 className="modal-title">Recent Transactions</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <div className="tabs-sets">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="purchase-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#purchase"
                      type="button"
                      aria-controls="purchase"
                      aria-selected="true"
                      role="tab"
                    >
                      Purchase
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="payment-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#payment"
                      type="button"
                      aria-controls="payment"
                      aria-selected="false"
                      role="tab"
                    >
                      Payment
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="return-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#return"
                      type="button"
                      aria-controls="return"
                      aria-selected="false"
                      role="tab"
                    >
                      Return
                    </button>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="purchase"
                    role="tabpanel"
                    aria-labelledby="purchase-tab"
                  >
                    <div className="table-top">
                      <div className="search-set">
                        <div className="search-input">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                      <div className="wordset">
                        <ul>
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
                        </ul>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table datanew">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Customer</th>
                            <th>Amount </th>
                            <th className="no-sort">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0101</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0102</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0103</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0104</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0105</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0106</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0107</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="payment" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set">
                        <div className="search-input">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                      <div className="wordset">
                        <ul>
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
                        </ul>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table datanew">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Customer</th>
                            <th>Amount </th>
                            <th className="no-sort">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0101</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0102</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0103</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0104</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0105</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0106</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0107</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="return" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set">
                        <div className="search-input">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                      <div className="wordset">
                        <ul>
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
                        </ul>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table datanew">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Customer</th>
                            <th>Amount </th>
                            <th className="no-sort">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0101</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0102</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0103</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0104</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0105</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0106</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0107</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Recent Transactions */}


      {/* Recent Transactions */}
      <div
        className="modal fade pos-modal"
        id="orders"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-md modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5 className="modal-title">Orders</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <div className="tabs-sets">
                <ul className="nav nav-tabs" id="myTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="onhold-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#onhold"
                      type="button"
                      aria-controls="onhold"
                      aria-selected="true"
                      role="tab"
                    >
                      Onhold
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="unpaid-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#unpaid"
                      type="button"
                      aria-controls="unpaid"
                      aria-selected="false"
                      role="tab"
                    >
                      Unpaid
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="paid-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#paid"
                      type="button"
                      aria-controls="paid"
                      aria-selected="false"
                      role="tab"
                    >
                      Paid
                    </button>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="onhold"
                    role="tabpanel"
                    aria-labelledby="onhold-tab"
                  >
                    <div className="table-top">
                      <div className="search-set w-100 search-order">
                        <div className="search-input w-100">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch w-100"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="order-body">
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-secondary d-inline-block mb-4">
                          Order ID : #666659
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Botsford</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$900</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">29-08-2023 13:39:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-sm-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-secondary d-inline-block mb-4">
                          Order ID : #666660
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Smith</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$15000</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">30-08-2023 15:59:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                      <div className="default-cover p-4">
                        <span className="badge bg-secondary d-inline-block mb-4">
                          Order ID : #666661
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">John David</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$2000</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">01-09-2023 13:15:00</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4 mb-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="unpaid" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set w-100 search-order">
                        <div className="search-input w-100">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch w-100"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="order-body">
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-info d-inline-block mb-4">
                          Order ID : #666662
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Anastasia</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$2500</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">10-09-2023 17:15:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-info d-inline-block mb-4">
                          Order ID : #666663
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Lucia</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$1500</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">11-09-2023 14:50:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-info d-inline-block mb-4">
                          Order ID : #666664
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Diego</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$30000</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">12-09-2023 17:22:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4 mb-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="paid" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set w-100 search-order">
                        <div className="search-input w-100">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch w-100"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="order-body">
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-primary d-inline-block mb-4">
                          Order ID : #666665
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Hugo</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$5000</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">13-09-2023 19:39:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-primary d-inline-block mb-4">
                          Order ID : #666666
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">Antonio</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$7000</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">15-09-2023 18:39:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                      <div className="default-cover p-4 mb-4">
                        <span className="badge bg-primary d-inline-block mb-4">
                          Order ID : #666667
                        </span>
                        <div className="row">
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr className="mb-3">
                                  <td>Cashier</td>
                                  <td className="colon">:</td>
                                  <td className="text">admin</td>
                                </tr>
                                <tr>
                                  <td>Customer</td>
                                  <td className="colon">:</td>
                                  <td className="text">MacQuoid</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-md-6 record mb-3">
                            <table>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td className="colon">:</td>
                                  <td className="text">$7050</td>
                                </tr>
                                <tr>
                                  <td>Date</td>
                                  <td className="colon">:</td>
                                  <td className="text">17-09-2023 19:39:11</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="p-4 mb-4">
                          Customer need to recheck the product once
                        </p>
                        <div className="btn-row d-flex align-items-center justify-content-between">
                          <Link
                            to="#"
                            className="btn btn-info btn-icon flex-fill"
                          >
                            Open
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Products
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Print
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Recent Transactions */}


    </div>
  )
}

export default Pos