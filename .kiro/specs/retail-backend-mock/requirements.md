# Requirements Document

## Introduction

Kết nối frontend template React hiện có với backend Spring Boot đã hoàn thiện để tạo thành một hệ thống Retail Management System hoạt động đầy đủ. Frontend sẽ tương tác với APIs thật của backend để thực hiện các chức năng quản lý bán lẻ với dữ liệu thật từ SQL Server database.

## Glossary

- **Frontend_Template**: Template React admin dashboard hiện có
- **Backend_System**: Hệ thống backend Spring Boot đã hoàn thiện
- **API_Integration**: Việc kết nối frontend với backend APIs
- **Real_Data**: Dữ liệu thật từ SQL Server database
- **Retail_Features**: Các chức năng quản lý bán lẻ (sản phẩm, khách hàng, hóa đơn, tồn kho, etc.)

## Requirements

### Requirement 1

**User Story:** Là một user, tôi muốn frontend template kết nối với backend thật để có thể thực hiện các chức năng quản lý bán lẻ với dữ liệu thật.

#### Acceptance Criteria

1. WHEN khởi động Frontend_Template, THE Frontend_Template SHALL kết nối thành công với Backend_System
2. WHEN đăng nhập, THE Frontend_Template SHALL gọi API authentication và lưu JWT token
3. WHEN thực hiện các thao tác CRUD, THE Frontend_Template SHALL gọi APIs tương ứng và cập nhật Real_Data
4. WHEN hiển thị dữ liệu, THE Frontend_Template SHALL fetch data từ Backend_System và render đúng format
5. THE Frontend_Template SHALL cấu hình base URL để gọi Backend_System trên port 8080

### Requirement 2

**User Story:** Là một admin, tôi muốn quản lý sản phẩm thông qua giao diện web, để tôi có thể thêm, sửa, xóa và tìm kiếm sản phẩm dễ dàng.

#### Acceptance Criteria

1. THE Frontend_Template SHALL hiển thị danh sách sản phẩm từ Backend_System với pagination
2. THE Frontend_Template SHALL cho phép thêm sản phẩm mới với đầy đủ thông tin
3. THE Frontend_Template SHALL cho phép chỉnh sửa thông tin sản phẩm hiện có
4. THE Frontend_Template SHALL cho phép tìm kiếm sản phẩm theo tên, mã, barcode
5. THE Frontend_Template SHALL cho phép upload ảnh sản phẩm lên Cloudinary

### Requirement 3

**User Story:** Là một nhân viên bán hàng, tôi muốn tạo hóa đơn bán hàng thông qua giao diện web, để tôi có thể xử lý đơn hàng nhanh chóng và chính xác.

#### Acceptance Criteria

1. THE Frontend_Template SHALL cho phép tạo hóa đơn mới với thông tin khách hàng
2. THE Frontend_Template SHALL cho phép thêm sản phẩm vào hóa đơn bằng cách tìm kiếm hoặc quét barcode
3. THE Frontend_Template SHALL tự động tính toán tổng tiền, thuế, chiết khấu
4. THE Frontend_Template SHALL cho phép chọn phương thức thanh toán (tiền mặt, chuyển khoản, MoMo)
5. THE Frontend_Template SHALL cập nhật tồn kho sau khi hoàn thành hóa đơn

### Requirement 4

**User Story:** Là một user, tôi muốn đăng nhập vào hệ thống với tài khoản của mình, để tôi có thể truy cập các chức năng phù hợp với quyền hạn.

#### Acceptance Criteria

1. THE Frontend_Template SHALL có trang đăng nhập với form username/password
2. THE Frontend_Template SHALL gọi API /api/auth/login và lưu JWT token vào localStorage
3. THE Frontend_Template SHALL hiển thị menu và chức năng phù hợp với role của user
4. THE Frontend_Template SHALL tự động redirect đến trang login khi token hết hạn
5. THE Frontend_Template SHALL có chức năng đăng xuất và xóa token

### Requirement 5

**User Story:** Là một manager, tôi muốn xem báo cáo và thống kê kinh doanh, để tôi có thể theo dõi hiệu quả hoạt động và đưa ra quyết định.

#### Acceptance Criteria

1. THE Frontend_Template SHALL hiển thị dashboard với các chỉ số tổng quan (doanh thu, đơn hàng, sản phẩm)
2. THE Frontend_Template SHALL có báo cáo doanh thu theo ngày, tháng, năm
3. THE Frontend_Template SHALL có báo cáo sản phẩm bán chạy và tồn kho
4. THE Frontend_Template SHALL có báo cáo khách hàng và nhà cung cấp
5. THE Frontend_Template SHALL cho phép xuất báo cáo dưới dạng PDF hoặc Excel