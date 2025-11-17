import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Input, message } from "antd";
import PropTypes from "prop-types";
import { 
  upsertSupplier, 
  clearCurrentSupplier,
  selectCurrentSupplier,
  selectSuppliersLoading 
} from "../../redux/supplierSlice";
import { selectUser } from "../../redux/authSlice";

const SupplierModal = ({ visible, onCancel, supplierId = null }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const currentSupplier = useSelector(selectCurrentSupplier);
  const loading = useSelector(selectSuppliersLoading);
  const user = useSelector(selectUser);
  


  useEffect(() => {
    if (visible) {
      if (supplierId && currentSupplier) {
        // Edit mode - populate form with current supplier data
        form.setFieldsValue({
          name: currentSupplier.name,
          contactNumber: currentSupplier.contactNumber,
          email: currentSupplier.email,
          address: currentSupplier.address,
          wardName: currentSupplier.wardName,
          organization: currentSupplier.organization,
          description: currentSupplier.description,
          comments: currentSupplier.comments,
        });

      } else {
        // Add mode - reset form
        form.resetFields();

      }
    }
  }, [visible, supplierId, currentSupplier, form]);

  const handleSubmit = async (values) => {
    try {
      console.log('User from auth:', user);
      console.log('User ID:', user?.userId);
      
      const supplierData = {
        ...values,
        createdBy: user?.userId?.toString() || "1", // Lấy từ auth context, fallback là "1"
      };
      
      console.log('Supplier data to send:', supplierData);

      if (supplierId) {
        supplierData.id = supplierId;
      }

      const result = await dispatch(upsertSupplier(supplierData)).unwrap();
      
      message.success(result.message || (supplierId ? 'Cập nhật nhà cung cấp thành công!' : 'Thêm nhà cung cấp thành công!'));
      
      form.resetFields();
      dispatch(clearCurrentSupplier());
      onCancel();
    } catch (error) {
      message.error(error || 'Có lỗi xảy ra!');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    dispatch(clearCurrentSupplier());
    onCancel();
  };
  return (
    <Modal
      title={supplierId ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <div className="row">
          <div className="col-md-12">
            <Form.Item
              label="Tên nhà cung cấp"
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập tên nhà cung cấp!' },
                { max: 200, message: 'Tên không được quá 200 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập tên nhà cung cấp" />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Số điện thoại"
              name="contactNumber"
              rules={[
                { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </div>
          
          <div className="col-md-6">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <Form.Item
              label="Địa chỉ"
              name="address"
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Phường/Xã"
              name="wardName"
            >
              <Input placeholder="Nhập phường/xã" />
            </Form.Item>
          </div>
          
          <div className="col-md-6">
            <Form.Item
              label="Tổ chức"
              name="organization"
            >
              <Input placeholder="Nhập tổ chức" />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <Form.Item
              label="Mô tả"
              name="description"
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Nhập mô tả" 
                maxLength={500}
                showCount
              />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <Form.Item
              label="Ghi chú"
              name="comments"
            >
              <Input.TextArea 
                rows={2} 
                placeholder="Nhập ghi chú" 
                maxLength={300}
                showCount
              />
            </Form.Item>
          </div>
        </div>

        <div className="modal-footer-btn d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={handleCancel}
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="btn btn-submit"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : (supplierId ? 'Cập nhật' : 'Thêm mới')}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default SupplierModal;

SupplierModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  supplierId: PropTypes.number,
};