import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Input, Select, DatePicker, InputNumber, Switch, message, Tabs, Table, Button, Space } from "antd";
import PropTypes from "prop-types";
import dayjs from 'dayjs';
import { 
  upsertVoucher, 
  clearCurrentVoucher,
  selectCurrentVoucher,
  selectVouchersLoading 
} from "../../redux/voucherSlice";
import { selectUser } from "../../redux/authSlice";
import { voucherService } from "../../api/voucherService";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const VoucherModal = ({ visible, onCancel, voucherId = null }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const currentVoucher = useSelector(selectCurrentVoucher);
  const loading = useSelector(selectVouchersLoading);
  const user = useSelector(selectUser);
  
  const [vouchers, setVouchers] = useState([]);
  const [vouchersLoading, setVouchersLoading] = useState(false);
  const [generateQuantity, setGenerateQuantity] = useState(1);
  const [campaignId, setCampaignId] = useState(null);
  const [activeTab, setActiveTab] = useState('campaign');

  useEffect(() => {
    if (visible) {
      if (voucherId && currentVoucher) {
        // Edit mode - populate form with current voucher data
        form.setFieldsValue({
          code: currentVoucher.code,
          name: currentVoucher.name,
          description: currentVoucher.description,
          discountType: currentVoucher.discountType,
          discountValue: currentVoucher.discountValue,
          minOrderValue: currentVoucher.minOrderValue,
          maxDiscountValue: currentVoucher.maxDiscountValue,
          quantity: currentVoucher.quantity,
          isUnlimited: currentVoucher.isUnlimited,
          isAutoGenerate: currentVoucher.isAutoGenerate,
          dateRange: currentVoucher.startDate && currentVoucher.endDate ? [
            dayjs(currentVoucher.startDate),
            dayjs(currentVoucher.endDate)
          ] : null,
        });
      } else {
        // Add mode - reset form
        form.resetFields();
      }
    }
  }, [visible, voucherId, currentVoucher, form]);

  const handleSubmit = async (values) => {
    try {
      const voucherData = {
        ...values,
        startDate: values.dateRange ? values.dateRange[0].toISOString() : null,
        endDate: values.dateRange ? values.dateRange[1].toISOString() : null,
        createdBy: user?.id?.toString() || "1",
      };

      // Remove dateRange from the data sent to API
      delete voucherData.dateRange;

      if (voucherId) {
        voucherData.id = voucherId;
      }

      const result = await dispatch(upsertVoucher(voucherData)).unwrap();
      
      message.success(result.message || (voucherId ? 'Cập nhật chiến dịch thành công!' : 'Thêm chiến dịch thành công!'));
      
      // Lưu campaign ID để load vouchers
      if (result.data && result.data.id) {
        setCampaignId(result.data.id);
        await loadVouchers(result.data.id);
        
        if (!voucherId) {
          // Nếu là tạo mới, tự động chuyển sang tab voucher và hiển thị hướng dẫn
          setActiveTab('vouchers');
          message.info('Chiến dịch đã được tạo! Bây giờ bạn có thể tạo voucher ở tab "Danh sách Voucher"', 5);
          return;
        }
      }
      
      if (!voucherId) {
        return;
      }
      
      form.resetFields();
      dispatch(clearCurrentVoucher());
      onCancel();
    } catch (error) {
      message.error(error || 'Có lỗi xảy ra!');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setVouchers([]);
    setCampaignId(null);
    setActiveTab('campaign');
    dispatch(clearCurrentVoucher());
    onCancel();
  };

  const loadVouchers = async (campaignId) => {
    if (!campaignId) return;
    
    setVouchersLoading(true);
    try {
      const voucherList = await voucherService.getVouchersByCampaign(campaignId);
      setVouchers(voucherList);
    } catch (error) {
      message.error('Không thể tải danh sách voucher');
    } finally {
      setVouchersLoading(false);
    }
  };

  const handleGenerateVouchers = async () => {
    if (!campaignId || generateQuantity < 1) {
      message.error('Vui lòng nhập số lượng hợp lệ');
      return;
    }

    try {
      const result = await voucherService.generateVouchers(campaignId, generateQuantity);
      message.success(result.message);
      await loadVouchers(campaignId);
      setGenerateQuantity(1);
    } catch (error) {
      message.error('Không thể tạo voucher');
    }
  };

  // Load vouchers when editing existing campaign
  useEffect(() => {
    if (voucherId && currentVoucher && currentVoucher.id) {
      setCampaignId(currentVoucher.id);
      loadVouchers(currentVoucher.id);
    }
  }, [voucherId, currentVoucher]);

  const discountTypeOptions = [
    { value: 1, label: 'Giảm giá cố định (VNĐ)' },
    { value: 2, label: 'Giảm giá theo phần trăm (%)' },
  ];

  const voucherColumns = [
    {
      title: 'Mã voucher',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Giá trị',
      dataIndex: 'discountValue',
      key: 'discountValue',
      render: (value) => `${value?.toLocaleString()} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isUsed',
      key: 'isUsed',
      render: (isUsed) => (
        <span className={`badge ${isUsed ? 'badge-danger' : 'badge-success'}`}>
          {isUsed ? 'Đã sử dụng' : 'Chưa sử dụng'}
        </span>
      ),
    },
    {
      title: 'Ngày sử dụng',
      dataIndex: 'usedDate',
      key: 'usedDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
  ];

  return (
    <Modal
      title={voucherId ? "Chỉnh sửa chiến dịch mã giảm giá" : "Thêm chiến dịch mã giảm giá"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      destroyOnClose
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Thông tin chiến dịch" key="campaign">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Mã giảm giá"
              name="code"
              rules={[
                { required: true, message: 'Vui lòng nhập mã giảm giá!' },
                { max: 50, message: 'Mã không được quá 50 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập mã giảm giá (VD: SUMMER2024)" />
            </Form.Item>
          </div>
          
          <div className="col-md-6">
            <Form.Item
              label="Tên chiến dịch"
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập tên chiến dịch!' },
                { max: 200, message: 'Tên không được quá 200 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập tên chiến dịch" />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <Form.Item
              label="Mô tả"
              name="description"
            >
              <TextArea 
                rows={3} 
                placeholder="Nhập mô tả chiến dịch" 
                maxLength={500}
                showCount
              />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Loại giảm giá"
              name="discountType"
              rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
            >
              <Select
                placeholder="Chọn loại giảm giá"
                options={discountTypeOptions}
              />
            </Form.Item>
          </div>
          
          <div className="col-md-6">
            <Form.Item
              label="Giá trị giảm"
              name="discountValue"
              rules={[
                { required: true, message: 'Vui lòng nhập giá trị giảm!' },
                { type: 'number', min: 0, message: 'Giá trị phải lớn hơn 0!' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập giá trị giảm"
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Giá trị đơn hàng tối thiểu"
              name="minOrderValue"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập giá trị tối thiểu"
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </div>
          
          <div className="col-md-6">
            <Form.Item
              label="Giá trị giảm tối đa"
              name="maxDiscountValue"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập giá trị giảm tối đa"
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Thời gian áp dụng"
              name="dateRange"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng!' }]}
            >
              <RangePicker
                style={{ width: '100%' }}
                showTime
                format="DD/MM/YYYY HH:mm"
                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
              />
            </Form.Item>
          </div>
          
          <div className="col-md-6">
            <Form.Item
              label="Số lượng"
              name="quantity"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số lượng voucher"
                min={1}
              />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Item
              label="Không giới hạn số lượng"
              name="isUnlimited"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </div>
          
          <div className="col-md-6">
            <Form.Item
              label="Tự động tạo mã"
              name="isAutoGenerate"
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
                {loading ? 'Đang xử lý...' : (voucherId ? 'Cập nhật' : 'Tạo chiến dịch')}
              </button>
            </div>
          </Form>
        </TabPane>
        
        <TabPane 
          tab={campaignId ? `Danh sách Voucher (${vouchers.length})` : 'Danh sách Voucher'} 
          key="vouchers"
          disabled={!campaignId}
        >
          {!campaignId ? (
            <div className="text-center p-4">
              <div className="alert alert-warning">
                <h5>Chưa có chiến dịch</h5>
                <p>Vui lòng tạo chiến dịch ở tab &quot;Thông tin chiến dịch&quot; trước khi tạo voucher.</p>
                <Button type="primary" onClick={() => setActiveTab('campaign')}>
                  Quay lại tạo chiến dịch
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="alert alert-info mb-3">
                <strong>Hướng dẫn:</strong> Tại đây bạn có thể tạo các mã voucher cụ thể từ chiến dịch đã tạo. 
                Mỗi voucher sẽ có mã riêng và có thể được sử dụng bởi khách hàng.
              </div>
              
              <div className="mb-3 p-3 border rounded">
                <h6>Tạo voucher mới</h6>
                <Space>
                  <span>Số lượng:</span>
                  <InputNumber
                    min={1}
                    max={100}
                    value={generateQuantity}
                    onChange={setGenerateQuantity}
                    placeholder="Nhập số lượng"
                  />
                  <Button 
                    type="primary" 
                    onClick={handleGenerateVouchers}
                    loading={vouchersLoading}
                    size="large"
                  >
                    Tạo {generateQuantity} Voucher
                  </Button>
                </Space>
              </div>
              
              <Table
                columns={voucherColumns}
                dataSource={vouchers}
                loading={vouchersLoading}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showTotal: (total) => `Tổng ${total} voucher`,
                }}
              />
            </>
          )}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

VoucherModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  voucherId: PropTypes.number,
};

export default VoucherModal;