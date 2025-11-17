import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../InitialPage/Sidebar/Header";
import Sidebar from "../InitialPage/Sidebar/Sidebar";
import { pagesRoute, posRoutes, publicRoutes, staffRoutes } from "./router.link";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeSettings from "../InitialPage/themeSettings";
import ProtectedRoute from "../core/components/ProtectedRoute";
// import CollapsedSidebar from "../InitialPage/Sidebar/collapsedSidebar";
import Loader from "../feature-module/loader/loader";
// import HorizontalSidebar from "../InitialPage/Sidebar/horizontalSidebar";
//import LoadingSpinner from "../InitialPage/Sidebar/LoadingSpinner";

const AllRoutes = () => {
  const data = useSelector((state) => state.toggle_header);
  // const layoutStyles = useSelector((state) => state.layoutstyledata);
  const HeaderLayout = () => (
    <ProtectedRoute>
      <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
        <Header />
        {/* {layoutStyles == "collapsed" ? (
          <CollapsedSidebar />
        ) : layoutStyles == "horizontal" ? (
          <HorizontalSidebar />
        ) : (
          <Sidebar />
        )} */}
        <Sidebar />
        <Outlet />
        <ThemeSettings />
        <Loader />
      </div>
    </ProtectedRoute>
  );

  const Authpages = () => (
    <div className={data ? "header-collapse" : ""}>
      <Outlet />
      <Loader />
      <ThemeSettings />
    </div>
  );

  const Pospages = () => (
    <div>
      <Header />
      <Outlet />
      <Loader />
      <ThemeSettings />
    </div>
  );

  const StaffPages = () => (
    <ProtectedRoute>
      <div className="main-wrapper">
        <Header />
        <Outlet />
        <ThemeSettings />
        <Loader />
      </div>
    </ProtectedRoute>
  );

  console.log(publicRoutes, "dashboard");

  return (
    <div>
      <Routes>
        {/* Staff Routes - chỉ có POS cho nhân viên */}
        {staffRoutes.map((route, id) => (
          <Route path={route.path} element={<StaffPages />} key={`staff-${id}`}>
            <Route index element={route.element} />
          </Route>
        ))}

        {/* POS Routes */}
        {posRoutes.map((route, id) => (
          <Route path={route.path} element={<Pospages />} key={`pos-${id}`}>
            <Route index element={route.element} />
          </Route>
        ))}
        
        {/* Auth Pages Routes */}
        {pagesRoute.map((route, id) => (
          <Route path={route.path} element={<Authpages />} key={`auth-${id}`}>
            <Route index element={route.element} />
          </Route>
        ))}

        {/* Public Routes with Header Layout */}
        {publicRoutes.map((route, id) => (
          <Route path={route.path} element={<HeaderLayout />} key={`public-${id}`}>
            <Route index element={route.element} />
          </Route>
        ))}
      </Routes>
    </div>
  );
};
export default AllRoutes;
