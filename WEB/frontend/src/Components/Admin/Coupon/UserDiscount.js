import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCopy } from "react-icons/fa";
import { useParams } from "react-router";
import AfterNav from "../../Home/NavBar/AfterNav";
import Footer from "../../Home/HomePages/Footer";
import "./Coupon.css";

function UserDiscount() {
  const [coupons, setCoupon] = useState([]);
  const [copiedCoupon, setCopiedCoupon] = useState(null); 
  const { id } = useParams();

  useEffect(() => {
    loadCoupon();
  }, []);

  const loadCoupon = async () => {
    try {
      const result = await axios.get("http://localhost:8081/coupon");
      const currentDate = new Date();
      // Filter out expired coupons
      const validCoupons = result.data.filter(
        (coupon) => new Date(coupon.endDate) > currentDate
      );
      setCoupon(validCoupons);
    } catch (error) {
      console.error("Error loading coupons:", error);
    }
  };

  const copyToClipboard = (text, couponId) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedCoupon(couponId);
        setTimeout(() => setCopiedCoupon(null), 2000); // Hide message after 2 seconds
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  return (
    <div>
      <AfterNav />
      <div className="body_container">
        <div className="coupan_card_set">
          {coupons.map((coupon) => (
            <div className="coupan_card" key={coupon.id}>
              <div className="card_body">
                <div className="name_coupan">{coupon.couponName}</div>
                <div className="sub_para">{coupon.description}</div>
                <div className="price_coupan">Rs.{coupon.price}.00</div>
                <div className="flex_seb">
                  <div className="datesub">Valid Until {coupon.endDate}</div>
                  <div className="coupancode">
                    {coupon.couponCode}{" "}
                    <FaCopy
                      onClick={() =>
                        copyToClipboard(coupon.couponCode, coupon.id)
                      }
                    />
                    {copiedCoupon === coupon.id && (
                      <p className="copy-feedback">Copied!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserDiscount;
