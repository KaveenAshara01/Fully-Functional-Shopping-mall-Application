import React from "react";
import "./footer.css";
import { FaFacebookF, FaYoutube, FaWhatsapp } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer_container">
      <div className="footer_wrapper">
        <div className="footer_section footer_about">
          <h4 className="footer_title">Shopping EYE</h4>
          <p className="footer_description">
            When was the last time you had an exciting and rewarding online
            shopping experience? Can’t remember? Let’s make it even more
            convenient, fast, and affordable to fulfill all your shopping needs
            with Sri Lanka's biggest online shopping store.
          </p>
        </div>
        <div className="footer_section footer_links">
          <h4 className="footer_title">Quick Links</h4>
          <ul className="footer_list">
            <li>
              <a href="#" className="footer_link">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="footer_link">
                Products
              </a>
            </li>
            <li>
              <a href="#" className="footer_link">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="footer_link">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="footer_link">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="footer_link">
                FAQ
              </a>
            </li>
          </ul>
        </div>
        <div className="footer_section footer_social">
          <h4 className="footer_title">Connect With Us</h4>
          <div className="footer_social_icons">
            <a href="#" className="social_icon" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="social_icon" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="#" className="social_icon" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
      <div className="footer_bottom">
        <p>
          &copy; {new Date().getFullYear()} Shopping EYE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
