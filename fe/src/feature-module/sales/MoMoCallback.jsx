import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckCircle, XCircle } from 'react-feather';
import { clearCart, clearSaleResult } from '../../core/redux/salesSlice';

const MoMoCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentStatus, setPaymentStatus] = useState('processing');

  useEffect(() => {
    // Kiểm tra nếu có lỗi từ URL
    const error = searchParams.get('error');
    if (error === 'momo_callback_failed') {
      setPaymentStatus('failed');
      return;
    }

    // Lấy các tham số từ URL callback của MoMo
    const resultCode = searchParams.get('resultCode');

    // Xử lý kết quả thanh toán
    if (resultCode === '0') {
      // Thanh toán thành công
      setPaymentStatus('success');
      // Clear cart sau khi thanh toán thành công
      dispatch(clearCart());
      dispatch(clearSaleResult());
    } else if (resultCode) {
      // Thanh toán thất bại
      setPaymentStatus('failed');
    }

    // Tự động chuyển về trang POS sau 5 giây
    const timer = setTimeout(() => {
      navigate('/pos');
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate, dispatch]);

  const handleBackToPOS = () => {
    navigate('/pos');
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center p-5">
                {paymentStatus === 'processing' && (
                  <>
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="sr-only">Đang xử lý...</span>
                    </div>
                    <h4>Đang xử lý kết quả thanh toán...</h4>
                    <p>Vui lòng chờ trong giây lát</p>
                  </>
                )}

                {paymentStatus === 'success' && (
                  <>
                    <div className="icon-head mb-3">
                      <CheckCircle className="feather-40 text-success" />
                    </div>
                    <h4 className="text-success">Thanh toán thành công!</h4>
                    <p>Đơn hàng của bạn đã được thanh toán thành công qua MoMo.</p>
                    <p><strong>Mã giao dịch:</strong> {searchParams.get('transId')}</p>
                    <p><strong>Mã đơn hàng:</strong> {searchParams.get('orderId')}</p>
                  </>
                )}

                {paymentStatus === 'failed' && (
                  <>
                    <div className="icon-head mb-3">
                      <XCircle className="feather-40 text-danger" />
                    </div>
                    <h4 className="text-danger">Thanh toán thất bại!</h4>
                    <p>Có lỗi xảy ra trong quá trình thanh toán.</p>
                    <p><strong>Lý do:</strong> {searchParams.get('message')}</p>
                  </>
                )}

                <div className="mt-4">
                  <button 
                    className="btn btn-primary"
                    onClick={handleBackToPOS}
                  >
                    Quay lại POS
                  </button>
                </div>

                <div className="mt-3">
                  <small className="text-muted">
                    Tự động chuyển về trang POS sau 5 giây...
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoMoCallback;