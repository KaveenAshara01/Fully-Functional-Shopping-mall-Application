import React, { useState, useEffect } from "react";
import "./nav.css";
import Logo from "./img/logo.png";

function Nav() {
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    
    setActivePage(window.location.pathname);
  }, []);

  
  const isActive = (path) => activePage === path;

  return (
    <div>
      <div className="nav_bar">
        <div>
          <img src={Logo} alt="logo" className="logo_nav" />
        </div>
        <div className="nav_item">
          <h3
            className={`nav_item_action ${isActive("/") ? "nav_item_action_active" : ""}`}
            onClick={() => (window.location.href = "/")}
          >
            Home
          </h3>
          <h3
            className={`nav_item_action ${isActive("/aboutus") ? "nav_item_action_active" : ""}`}
            onClick={() => (window.location.href = "/aboutus")}
          >
            About Us
          </h3>
          <h3
            className={`nav_item_action ${isActive("/contactus") ? "nav_item_action_active" : ""}`}
            onClick={() => (window.location.href = "/contactus")}
          >
            Contact Us
          </h3>
          <div className="nav_btn">
            <button className="log_btn" onClick={() => (window.location.href = "/login")}>SIGN UP</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
