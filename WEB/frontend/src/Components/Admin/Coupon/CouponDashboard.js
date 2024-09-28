import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import SideBar from "../SideBar/SideBar";
import jsPDF from "jspdf";
import "jspdf-autotable";

function CouponDashboard() {
  const [coupons, setCoupon] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();

  useEffect(() => {
    loadCoupon();
  }, []);

  const loadCoupon = async () => {
    try {
      const result = await axios.get("http://localhost:8081/coupon");
      setCoupon(result.data);
    } catch (error) {
      console.error("Error loading coupons:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this coupon?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8081/coupon/${id}`);
        loadCoupon();
        alert("Coupon deleted successfully!");
      } catch (error) {
        console.error("Error deleting coupon:", error);
        alert("An error occurred while deleting the coupon.");
      }
    }
  };

  const getCouponStatusClass = (endDate) => {
    const currentDate = new Date();
    const expiryDate = new Date(endDate);
    return currentDate > expiryDate ? "expired" : "valid";
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.couponName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.couponCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Coupon Report", 14, 16);
    doc.autoTable({
      startY: 30,
      head: [
        ['Coupon Name', 'Coupon Code', 'Description', 'Price', 'Start Date', 'End Date', 'Status']
      ],
      body: filteredCoupons.map(coupon => [
        coupon.couponName,
        coupon.couponCode,
        coupon.description,
        coupon.price,
        coupon.startDate,
        coupon.endDate,
        getCouponStatusClass(coupon.endDate) === "expired" ? "Expired" : "Valid"
      ]),
    });

    doc.save("coupon-report.pdf");
  };

  return (
    <div>
      <div className="main_body_admin">
        <div className="nav_section">
          <SideBar />
        </div>
        <div className="details_body">
          <h1>Coupon Dashboard</h1>

          <div className="action_set_admin">
            <button
              className="add_btn_admin"
              onClick={() => (window.location.href = "/addcoupon")}
            >
              Create New Coupon
            </button>
            { <input
              type="text"
              className="search_admin"
              placeholder="Search Here By Coupon Name..."
              value={searchTerm}
              onChange={handleSearchChange}
            /> }
            { <button
              className="add_btn_admin"
              onClick={handleDownloadPDF}
            >
              Generate Report
            </button> }
          </div>
          <table className="admin_table">
            <thead className="admin_table_head">
              <tr className="admintable_tr_hd">
                <th className="admin_table_th">Coupon Name</th>
                <th className="admin_table_th">Coupon Code</th>
                <th className="admin_table_th">Description</th>
                <th className="admin_table_th">Price</th>
                <th className="admin_table_th">Start Date</th>
                <th className="admin_table_th">End Date</th>
                <th className="admin_table_th">Status</th>
                <th className="admin_table_th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon) => (
                <tr className="admintable_tr" key={coupon.id}>
                  <td className="admin_table_td">{coupon.couponName}</td>
                  <td className="admin_table_td">{coupon.couponCode}</td>
                  <td className="admin_table_td dis_with">
                    {coupon.description}
                  </td>
                  <td className="admin_table_td">{coupon.price}</td>
                  <td className="admin_table_td">{coupon.startDate}</td>
                  <td className="admin_table_td">{coupon.endDate}</td>
                  <td className={`admin_table_td ${getCouponStatusClass(coupon.endDate)}`}>
                    {getCouponStatusClass(coupon.endDate) === "expired" ? "Expired" : "Valid"}
                  </td>
                  <td className="admin_table_td">
                    <Link className="btn-update" to={`/updatecoupon/${coupon.id}`}>
                      Edit
                    </Link>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(coupon.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CouponDashboard;
