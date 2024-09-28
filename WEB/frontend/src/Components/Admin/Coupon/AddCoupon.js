import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../admin.css";
import SideBar from "../SideBar/SideBar";
function AddCoupon() {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState({
    couponName: "",
    couponCode: "",
    description: "",
    price: "",
    startDate: "",
    endDate: "",
  });

  const { couponName, couponCode, description, price, startDate, endDate } =
    coupon;

  
  const generateCouponCode = () => {
    const prefix = "SE";
    const randomDigits = Math.random().toString().slice(2, 13); 
    return prefix + randomDigits;
  };

  
  useEffect(() => {
    const code = generateCouponCode();
    setCoupon((prevCoupon) => ({
      ...prevCoupon,
      couponCode: code,
    }));
  }, []);

  const onInputChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8081/coupon", coupon);
      alert("Coupon created successfully");
      navigate("/coupondash");
    } catch (error) {
      console.error("Error creating coupon:", error);
      alert("Failed to create coupon");
    }
  };

  return (
    <div>
      <div className="main_body_admin">
        <div className="nav_section">
          <SideBar />
        </div>
        <div className="details_body">
          <h2 className="topic_update">Add New Coupon</h2>
          <form className="from_container" onSubmit={(e) => onSubmit(e)}>
            <label className="from_label">Coupon Name</label>
            <input
              className="from_input"
              type="text"
              name="couponName"
              value={couponName}
              onChange={(e) => onInputChange(e)}
              placeholder=""
              required
            />
             <label className="from_label">Coupon Price</label>
            <input
              className="from_input"
              type="number"
              name="price"
              value={price}
              onChange={(e) => onInputChange(e)}
              required
            />
            <label className="from_label">Coupon Code</label>
            <input
              className="from_input"
              type="text"
              name="couponCode"
              value={couponCode}
              onChange={(e) => onInputChange(e)}
              readOnly
            />

     
            <label className="from_label">Start Date</label>
            <input
              className="from_input"
              type="date"
              name="startDate"
              value={startDate}
              onChange={(e) => onInputChange(e)}
              required
            />
            <label className="from_label">Expired Date</label>
            <input
              className="from_input"
              type="date"
              name="endDate"
              value={endDate}
              onChange={(e) => onInputChange(e)}
              required
            />
                   <label className="from_label">Description</label>
            <textarea
              type="text"
                className="from_input"
              name="description"
              value={description}
              onChange={(e) => onInputChange(e)}
              placeholder=""
            />
            <button type="submit" className="from_btn">Create Coupon</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCoupon;
