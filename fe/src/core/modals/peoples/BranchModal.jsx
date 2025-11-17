import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Input, Switch, message, Select } from "antd";
import PropTypes from "prop-types";
import { 
  upsertBranch, 
  clearCurrentBranch,
  selectCurrentBranch,
  selectBranchesLoading 
} from "../../redux/branchSlice";
import { selectUser } from "../../redux/authSlice";



const BranchModal = ({ visible, onCancel, branchId = null }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const currentBranch = useSelector(selectCurrentBranch);
  const loading = useSelector(selectBranchesLoading);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (visible) {
      if (branchId && currentBranch) {
        // Edit mode - populate form with current branch data
        form.setFieldsValue({
          branchCode: currentBranch.branchCode,
          name: currentBranch.name,
          address: currentBranch.address,
          wardName: currentBranch.wardName,
          districtName: currentBranch.districtName,
          cityName: currentBranch.cityName,
          phoneNumber: currentBranch.phoneNumber,
          email: currentBranch.email,
          isMain: currentBranch.isMain,
          level: currentBranch.level,
        });
      } else {
        // Add mode - reset form
        form.resetFields();
      }
    }
  }, [visible, branchId, currentBranch, form]);

  const handleSubmit = async (values) => {
    try {
      const branchData = {
        ...values,
        createdBy: user?.id?.toString() || "1",
      };

      if (branchId) {
        branchData.id = branchId;
      }

      const result = await dispatch(upsertBranch(branchData)).unwrap();
      
      message.success(result.message || (branchId ? 'Cập nhật chi nhánh thành công!' : 'Thêm chi nhánh thành công!'));
      
      form.resetFields();
      dispatch(clearCurrentBranch());
      onCancel();
    } catch (error) {
      message.error(error || 'Có lỗi xảy ra!');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    dispatch(clearCurrentBranch());
    onCancel();
  };

  const levelOptions = [
    { value: 1, label: 'Cấp 1 - Trụ sở chính' },
    { value: 2, label: 'Cấp 2 - Chi nhánh' },
    { value: 3, label: 'Cấp 3 - Cửa hàng' },
  ];

  return (
    <Modal
      title={branchId ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh"}
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
          <div className="col-md-6">
            <Form.Item
              label="Mã chi nhánh"
              name="branchCode"
              rules={[
                { max: 50, message: 'Mã không được quá 50 ký tự!' }
              ]}
            >
              <Input placeholder="Để trống để tự động tạo mã" />
            </Form.Item>
          </div>
          
          <div className="col-md-6">
            <Form.Item
              label="Tên chi nhánh"
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập tên chi nhánh!' },
                { max: 200, message: 'Tên không được quá 200 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập tên chi nhánh" />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <Form.Item
              label="Địa chỉ"
              name="address"
            >
              <Input placeholder="Nhập địa chỉ chi nhánh" />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <Form.Item
              label="Phường/Xã"
              name="wardName"
            >
              <Input placeholder="Nhập phường/xã" />
            </Form.Item>
          </div>
          
          <div className="col-md-4">
            <Form.Item
              label="Quận/Huyện"
              name="districtName"
            >
              <Input placeholder="Nhập quận/huyện" />
            </Form.Item>
          </div>
          
          <div className="col-md-4">
            <Form.Item
              label="Tỉnh/Thành phố"
              name="cityName"
            >
              <Input placeholder="Nhập tỉnh/thành phố" />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
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
          <div className="col-md-6">
            <Form.Item
              label="Cấp độ"
              name="level"
            >
              <Select
                placeholder="Chọn cấp độ chi nhánh"
                options={levelOptions}
              />
            </Form.Item>
          </div>
          
          <div className="col-md-6">
            <Form.Item
              label="Chi nhánh chính"
              name="isMain"
              valuePropName="checked"
            >
              <Switch />
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
            {loading ? 'Đang xử lý...' : (branchId ? 'Cập nhật' : 'Thêm mới')}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

BranchModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  branchId: PropTypes.number,
};

export default BranchModal;