import React, { useState, useEffect } from "react";
import "./side.css";
import DashLogo from "./img/logo.png";
function SideBar() {
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    // Set the active page based on the current path
    setActivePage(window.location.pathname);
  }, []);

  // Determine if the current page is active
  const isActive = (path) => activePage === path;

  // Function to handle logout
  const handleLogout = () => {
    if (window.confirm("Do you want to log out?")) {
      window.location.href = "/login"; // Navigate to login page
    }
  };
  return (
    <div>
      <div className="full_side">
        <div className="main_setlogo">
          <img src={DashLogo} alt="logo" className="logo_admin" />
          <h1>ShoppinEYE</h1>
        </div>
        <div className="side_nav">
          <h3
            className={`nav_side_item ${
              isActive("/admindash") ? "nav_item_action_active_admin" : ""
            }`}
            onClick={() => (window.location.href = "/admindash")}
          >
            User
          </h3>
          <h3
            className={`nav_side_item ${
              isActive("/orderdash") ? "nav_item_action_active_admin" : ""
            }`}
            onClick={() => (window.location.href = "/orderdash")}
          >
            Order{" "}
          </h3>
          <h3
            className={`nav_side_item ${
              isActive("/productdashboard")
                ? "nav_item_action_active_admin"
                : ""
            }`}
            onClick={() => (window.location.href = "/productdashboard")}
          >
            Product{" "}
          </h3>
          <h3
            className={`nav_side_item ${
              isActive("/coupondash") ? "nav_item_action_active_admin" : ""
            }`}
            onClick={() => (window.location.href = "/coupondash")}
          >
            Discount{" "}
          </h3>
        </div>
        <div>
          <h3 className="nav_side_item" onClick={handleLogout}>
            Logout
          </h3>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
