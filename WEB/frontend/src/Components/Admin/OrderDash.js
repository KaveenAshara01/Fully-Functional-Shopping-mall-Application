import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Title of the document
    doc.setFontSize(18);
    doc.text("Order Details Report", 14, 22);

    // Subtitle (e.g., date of generation)
    const date = new Date().toLocaleString();
    doc.setFontSize(12);
    doc.text(`Report generated on: ${date}`, 14, 30);

    // Beautified table with teal header
    doc.autoTable({
      startY: 40,
      head: [["Order ID", "Total Price (Rs.)"]],
      body: filteredOrders.map((order) => [
        order.id,
        `Rs.${order.totalPrice}.00`,
      ]),
      theme: "striped", // Adds a striped design to the table
      headStyles: {
        fillColor: [80, 127, 181], // Teal color for header (you can adjust this RGB value)
        textColor: [255, 255, 255], // White text for header
        fontSize: 12, // Adjust header font size
      },
      bodyStyles: {
        fontSize: 10, // Adjust body font size
        cellPadding: 6, // Add padding to table cells
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light gray for alternate rows
      },
      margin: { top: 40 }, 
      styles: {
        cellPadding: 4, 
        halign: "center", 
        valign: "middle", 
        lineWidth: 0.1, // Border width
      },
    });

    // Footer (optional)
    doc.setFontSize(10);
    doc.text("End of report", 14, doc.lastAutoTable.finalY + 10);

    // Save the PDF
    doc.save("order-details-report.pdf");
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
