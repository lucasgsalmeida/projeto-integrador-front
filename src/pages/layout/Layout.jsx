import React from "react";
import Footer from "../../components/layout/Footer";
import Topbar from "../../components/layout/Topbar";
import Sidebar from "../../components/layout/Sidebar";

const Layout = ({ children }) => {
  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Topbar />
          <div className="container-fluid">
              {children}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
