import React from 'react';
import * as Icon from 'react-feather';

export const SidebarData = [
          
    {
        label: "Chính",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "Chính",
        submenuItems: [
        {
            label: "Bảng điều khiển",
            icon: <Icon.Grid  />,
            submenu: true,
            showSubRoute: false,

            submenuItems: [
              { label: "Bảng điều khiển Admin", link: "/" },
              { label: "Bảng điều khiển Bán hàng", link: "/sales-dashboard" }
            ]
          }
        ]
      },
      {
        label: "Kho hàng",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "Kho hàng",
      
        submenuItems: [
          { label: "Sản phẩm", link: "/product-list", icon:<Icon.Box />,showSubRoute: false,submenu: false },
          { label: "Danh mục", link: "/category-list", icon:  <Icon.Codepen />,showSubRoute: false,submenu: false },
          { label: "In mã vạch", link: "/barcode", icon: <Icon.AlignJustify />, showSubRoute: false,submenu: false },
          { label: "In mã QR", link: "/qrcode", icon:  <Icon.Maximize  />,showSubRoute: false,submenu: false }
        ]
      },
      {
        label: "Tồn kho",
        submenuOpen: true,
        submenuHdr: "Tồn kho",
        submenu: true,
        showSubRoute: false,
        submenuItems: [
          { label: "Quản lý tồn kho", link: "/manage-stocks", icon:  <Icon.Package />,showSubRoute: false,submenu: false },
          { label: "Nhập kho", link: "/purchase-list", icon:  <Icon.ShoppingBag />,showSubRoute: false,submenu: false },
          { label: "Xuất kho", link: "/stock-transfer", icon:  <Icon.Truck />,showSubRoute: false,submenu: false }
        ]
      },
      {
        label: "Bán hàng",
        submenuOpen: true,
        submenuHdr: "Bán hàng",
        submenu: false,
        showSubRoute: false,
        submenuItems: [
          { label: "Hóa đơn", link: "/invoice-report", icon:  <Icon.FileText />,showSubRoute: false,submenu: false },
          { label: "POS", link: "/pos", icon:  <Icon.HardDrive />,showSubRoute: false,submenu: false }
        ]
      },
      {
        label: "Khuyến mãi",
        submenuOpen: true,
        submenuHdr: "Khuyến mãi",
        showSubRoute: false,
        submenuItems: [
          { label: "Mã giảm giá", link: "/coupons", icon:  <Icon.ShoppingCart />,showSubRoute: false, submenu: false }
        ]
      },

      {
        label: "Người dùng",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "Người dùng",
      
        submenuItems: [
          { label: "Khách hàng", link: "/customers", icon:<Icon.User />,showSubRoute: false,submenu: false },
          { label: "Nhà cung cấp", link: "/suppliers", icon:  <Icon.Users />,showSubRoute: false, submenu: false },
          { label: "Cửa hàng", link: "/branches", icon:  <Icon.Home  />,showSubRoute: false,submenu: false },
     
        ]
      },
      {
        label: "Nhân sự",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "Nhân sự",
        submenuItems: [
          { label: "Nhân viên", link: "/employees-grid", icon:  <Icon.Users />,showSubRoute: false },
          { label: "Chức danh", link: "/designation", icon:  <Icon.UserCheck />,showSubRoute: false }
        ],
      },
      // {
      //   label: "Báo cáo",
      //   submenuOpen: true,
      //   showSubRoute: false,
      //   submenuHdr: "Báo cáo",
      //   submenuItems: [
      //     { label: "Báo cáo bán hàng", link: "/sales-report", icon:  <Icon.BarChart2 /> ,showSubRoute: false},
      //     { label: "Báo cáo tồn kho", link: "/inventory-report", icon:  <Icon.Inbox />,showSubRoute: false },
      //     { label: "Báo cáo hóa đơn", link: "/invoice-report", icon:  <Icon.File />,showSubRoute: false },
      //     { label: "Báo cáo nhà cung cấp", link: "/supplier-report", icon:  <Icon.UserCheck />,showSubRoute: false },
      //     { label: "Báo cáo khách hàng", link: "/customer-report", icon:  <Icon.User />,showSubRoute: false },
      //     { label: "Lãi & Lỗ", link: "/profit-loss-report", icon:  <Icon.TrendingDown />,showSubRoute: false }
      //   ],
      // },



      {
        label: "Cài đặt",
        submenu: true,
        showSubRoute: false,
        submenuHdr: "Cài đặt",
        submenuItems: [
          { label: "Đăng xuất", link: "/signin", icon:  <Icon.LogOut />,showSubRoute: false }
        ]
      }
      


]
