import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SideBar from "../../Admin/SideBar/SideBar";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ProductDetails() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const result = await axios.get("http://localhost:8081/productmanagement");
      setProducts(result.data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Product?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8081/productmanagement/${id}`);
        loadProducts();
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting Product:", error);
        alert(
          "Can't Delete This Item , This Item Customers are on their way to buy."
        );
      }
    }
  };

  // Function to handle PDF download with enhanced styling
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Title of the document
    doc.setFontSize(18);
    doc.text("Product Details Report", 14, 22);

    // Subtitle (e.g., date of generation)
    const date = new Date().toLocaleString();
    doc.setFontSize(12);
    doc.text(`Report generated on: ${date}`, 14, 30);

    // Beautified table with teal header
    doc.autoTable({
      startY: 40,
      head: [
        ["ID", "Item Name", "Category", "Price", "Quantity", "Description"],
      ],
      body: products.map((product) => [
        product.id,
        product.itemname,
        product.category,
        product.price,
        product.quantity,
        product.description,
      ]),
      theme: "striped", 
      headStyles: {
        fillColor: [80, 127, 181], 
        textColor: [255, 255, 255], 
        fontSize: 12, 
      },
      bodyStyles: {
        fontSize: 10, 
        cellPadding: 6, 
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], 
      },
      margin: { top: 40 }, 
      styles: {
        cellPadding: 4, 
        halign: "center", 
        valign: "middle", 
        lineWidth: 0.1, 
      },
    });

    
    doc.setFontSize(10);
    doc.text("End of report", 14, doc.lastAutoTable.finalY + 10);

    
    doc.save("product-details-report.pdf");
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.itemname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="main_body_admin">
        <div className="nav_section">
          <SideBar />
        </div>
        <div className="details_body">
          <h1>Product List</h1>

          <div className="action_set_admin">
            <button
              className="add_btn_admin"
              onClick={() => (window.location.href = "/addproduct")}
            >
              Add Product
            </button>
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
                <th className="admin_table_th">Item Name</th>
                <th className="admin_table_th">Category</th>
                <th className="admin_table_th">Price</th>
                <th className="admin_table_th">Quantity</th>
                <th className="admin_table_th">Description</th>
                <th className="admin_table_th">Image</th>
                <th className="admin_table_th">Action</th>
              </tr>
            </thead>
            <tbody className="details_body_table">
              {filteredProducts.map((product) => (
                <tr className="admintable_tr" key={product.id}>
                  <td className="admin_table_td">{product.id}</td>
                  <td className="admin_table_td">{product.itemname}</td>
                  <td className="admin_table_td">{product.category}</td>
                  <td className="admin_table_td">{product.price}</td>
                  <td className="admin_table_td">{product.quantity}</td>
                  <td className="admin_table_td dis_with">
                    {product.description}
                  </td>
                  <td className="admin_table_td img_rwo">
                    <img
                      src={`http://localhost:8081/${product.imagePath}`} // Adjust this path if needed
                      alt={product.itemname}
                      className="tble_img"
                    />
                  </td>
                  <td className="admin_table_td btn_set">
                    <Link
                      to={`/updateproduct/${product.id}`}
                      className="btn-update"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="btn-delete"
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

export default ProductDetails;
