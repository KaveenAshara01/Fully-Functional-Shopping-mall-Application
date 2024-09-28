import React, { useEffect, useState } from "react";
import SideBar from "./SideBar/SideBar";
import "./admin.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

function AdminDash() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch user data from the API
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8081/usermanagement");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.gmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to download user details as a PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("User Details", 14, 16);

    // Add table
    doc.autoTable({
      startY: 30,
      head: [['ID', 'Username', 'Full Name', 'Email', 'Phone']],
      body: filteredUsers.map(user => [
        user.id,
        user.username,
        user.fullname,
        user.gmail,
        user.phone
      ]),
    });

    doc.save("user-details.pdf");
  };

  return (
    <div>
      <div className="main_body_admin">
        <div className="nav_section">
          <SideBar />
        </div>
        <div className="details_body">
          <h1>User Details</h1>
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
          <table className="admin_table">
            <thead className="admin_table_head">
              <tr className="admintable_tr_hd">
                <th className="admin_table_th">ID</th>
                <th className="admin_table_th">Username</th>
                <th className="admin_table_th">Full Name</th>
                <th className="admin_table_th">Email</th>
                <th className="admin_table_th">Phone</th>
              </tr>
            </thead>
            <tbody className="details_body_table">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr className="admintable_tr" key={user.id}>
                    <td className="admin_table_td">{user.id}</td>
                    <td className="admin_table_td">{user.username}</td>
                    <td className="admin_table_td">{user.fullname}</td>
                    <td className="admin_table_td">{user.gmail}</td>
                    <td className="admin_table_td">{user.phone}</td>
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

export default AdminDash;
