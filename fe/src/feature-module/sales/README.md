# Hệ thống POS (Point of Sale)

## Tổng quan
Hệ thống POS được thiết kế dành riêng cho nhân viên cửa hàng để thực hiện các giao dịch bán hàng một cách nhanh chóng và hiệu quả.

## Tính năng chính

### 1. Quản lý sản phẩm
- Hiển thị danh sách sản phẩm theo danh mục
- Tìm kiếm sản phẩm theo tên, mã sản phẩm
- Hiển thị thông tin chi tiết: tên, giá, tồn kho
- Hỗ trợ quét mã vạch (barcode)

### 2. Quản lý giỏ hàng
- Thêm sản phẩm vào giỏ hàng
- Cập nhật số lượng sản phẩm
- Xóa sản phẩm khỏi giỏ hàng
- Tính toán tự động tổng tiền

### 3. Quản lý khách hàng
- Chọn khách hàng từ danh sách
- Hỗ trợ khách lẻ (walk-in customer)
- Thêm khách hàng mới nhanh

### 4. Thanh toán
- **Tiền mặt**: Thanh toán trực tiếp
- **MoMo**: Tạo QR code thanh toán
- Xử lý thanh toán real-time
- In hóa đơn sau khi thanh toán

### 5. Báo cáo và theo dõi
- Lịch sử giao dịch
- Thống kê bán hàng theo ca
- Quản lý tồn kho real-time

## Quy trình sử dụng

### Bước 1: Đăng nhập
- Nhân viên đăng nhập bằng tài khoản được cấp
- Hệ thống tự động chuyển đến giao diện POS

### Bước 2: Chọn sản phẩm
1. Duyệt danh mục sản phẩm
2. Click vào sản phẩm để thêm vào giỏ hàng
3. Hoặc quét mã vạch sản phẩm

### Bước 3: Quản lý giỏ hàng
1. Kiểm tra sản phẩm trong giỏ hàng
2. Điều chỉnh số lượng nếu cần
3. Xóa sản phẩm không mong muốn

### Bước 4: Chọn khách hàng
1. Chọn "Khách lẻ" cho khách hàng thường
2. Hoặc tìm và chọn khách hàng có tài khoản
3. Thêm khách hàng mới nếu cần

### Bước 5: Thanh toán
1. Chọn phương thức thanh toán
2. Xác nhận thông tin đơn hàng
3. Xử lý thanh toán
4. In hóa đơn cho khách hàng

## Phím tắt hữu ích
- `F1`: Tìm kiếm sản phẩm
- `F2`: Thêm khách hàng mới
- `F3`: Thanh toán tiền mặt
- `F4`: Thanh toán MoMo
- `Esc`: Hủy giao dịch hiện tại

## Lưu ý quan trọng

### Bảo mật
- Không chia sẻ thông tin đăng nhập
- Đăng xuất khi kết thúc ca làm việc
- Báo cáo ngay nếu có sự cố bảo mật

### Xử lý lỗi
- Kiểm tra kết nối mạng nếu không tải được dữ liệu
- Liên hệ quản lý nếu có lỗi thanh toán
- Backup dữ liệu định kỳ

### Hiệu suất
- Đóng các ứng dụng không cần thiết
- Làm sạch cache trình duyệt định kỳ
- Cập nhật phần mềm khi có thông báo

## Hỗ trợ kỹ thuật
- **Hotline**: 1900-xxxx
- **Email**: support@company.com
- **Thời gian hỗ trợ**: 8:00 - 22:00 hàng ngày

## Cập nhật phiên bản
- **v1.0.0**: Phiên bản đầu tiên
- **v1.1.0**: Thêm thanh toán MoMo
- **v1.2.0**: Cải thiện giao diện và hiệu suất