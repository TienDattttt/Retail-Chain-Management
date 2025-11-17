# Hướng dẫn chạy dự án

## Yêu cầu hệ thống
- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn

## Cài đặt

1. Cài đặt các dependencies:
```bash
npm install
```

2. Chạy ứng dụng ở chế độ development:
```bash
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:3000/react/template/

## Build cho production

```bash
npm run build
```

## Các lệnh khác

- Chạy tests: `npm test`
- Lint code: `npm run lint`
- Fix lint issues: `npm run lint:fix`

## Lưu ý

- Dự án đã được cấu hình với base path là `/react/template/`
- Nếu muốn thay đổi base path, chỉnh sửa file `src/environment.jsx`
- Có 2 warnings CSS nhỏ về `url()` rỗng trong SCSS, không ảnh hưởng đến chức năng

## Cấu trúc dự án

```
src/
├── core/              # Core utilities, Redux, JSON data
├── feature-module/    # Các module chức năng chính
├── InitialPage/       # Layout components (Header, Sidebar)
├── Router/            # Cấu hình routing
├── style/             # CSS, SCSS, fonts, icons
└── index.js           # Entry point
```

## Đã sửa

- ✅ Đã xóa toàn bộ tính năng chat khỏi dự án
- ✅ Đã kiểm tra và sửa tất cả các lỗi import
- ✅ Ứng dụng compile và chạy thành công
