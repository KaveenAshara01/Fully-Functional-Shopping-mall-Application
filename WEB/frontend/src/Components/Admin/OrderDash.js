import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./admin.css";
import SideBar from "./SideBar/SideBar";

function OrderDash() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch order data from the API
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8081/payment");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);


  // Function to handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) =>
    Object.values(order).some((val) =>
      val.toString().toLowerCase().includes(searchTerm)
    )
  );

  // Function to handle PDF download
  const handleDownloadPDF = async () => {
    const input = document.getElementById("order-table");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("order_details.pdf");
  };

  return (
    <div>
      <div className="main_body_admin">
        <div className="nav_section">
          <SideBar />
        </div>
        <div className="details_body">
          <h1>Order Details</h1>
          <div className="action_set_admin">
            <input
              type="text"
              className="search_admin"
              placeholder="Search Here..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="add_btn_admin" onClick={handleDownloadPDF}>
              Generate Report
            </button>
          </div>
          <table className="admin_table" id="order-table">
            <thead className="admin_table_head">
              <tr className="admintable_tr_hd">
                <th className="admin_table_th">Order ID</th>
                <th className="admin_table_th">Total Price</th>
              </tr>
            </thead>
            <tbody className="details_body_table">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="4">No orders found</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr className="admintable_tr" key={order.id}>
                    <td className="admin_table_td">{order.id}</td>
                    <td className="admin_table_td">Rs.{order.totalPrice}.00</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderDash;
