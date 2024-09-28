

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import SideBar from "../../Admin/SideBar/SideBar";

function AddProduct() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL params if present

  const [product, setProduct] = useState({
    itemname: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    seller: "", // Using "seller" for shop name
    image: null, // Added for image upload
  });

  const [previewUrl, setPreviewUrl] = useState(""); // State for image preview

  const { itemname, category, price, quantity, description, seller, image } =
    product;

  useEffect(() => {
    if (id) {
      // Fetch product details for update
      axios
        .get(`http://localhost:8081/productmanagement/${id}`)
        .then((response) => {
          setProduct({
            ...response.data,
            image: null, // reset image if you want to keep the existing one
          });
          // Set preview URL if there's an existing image
          setPreviewUrl(`http://localhost:8081/uploads/${response.data.image}`);
        })
        .catch((error) => {
          console.error("There was an error fetching the product!", error);
        });
    }
  }, [id]);

  const onInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setProduct({ ...product, [name]: file });

      // Create a URL for the image preview
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewUrl(fileReader.result);
      };
      if (file) {
        fileReader.readAsDataURL(file);
      }
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("itemname", itemname);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);
    formData.append("seller", seller); // Sending the seller (shop name) to backend
    if (image) {
      formData.append("image", image);
    }

    try {
      if (id) {
        await axios.put(
          `http://localhost:8081/productmanagement/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Product updated successfully");
      } else {
        await axios.post("http://localhost:8081/productmanagement", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Product added successfully");
      }
      navigate("/productdashboard");
    } catch (error) {
      console.error("There was an error saving the product!", error);
    }
  };

  return (
    <div>
      <div className="main_body_admin">
        <div className="nav_section">
          <SideBar />
        </div>
        <div className="details_body">
          <h2 className="topic_update">
            {id ? "Update Product" : "Add New Product"}
          </h2>
          <form className="from_container" onSubmit={onSubmit}>
            <div className="form-group">
              <label className="from_label" htmlFor="itemname">
                Item Name:
              </label>
              <input
                className="from_input"
                type="text"
                id="itemname"
                name="itemname"
                value={itemname}
                onChange={onInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="from_label" htmlFor="category">
                Category:
              </label>
              <select
                id="category"
                className="from_input"
                name="category"
                value={category}
                onChange={onInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Beauty & Personal Care">
                  Beauty & Personal Care
                </option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Toys & Games">Toys & Games</option>
                <option value="Books & Stationery">Books & Stationery</option>
                <option value="Health & Wellness">Health & Wellness</option>
              </select>
            </div>

            <div className="form-group">
              <label className="from_label" htmlFor="price">
                Price:
              </label>
              <input
                className="from_input"
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={onInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="from_label" htmlFor="quantity">
                Quantity:
              </label>
              <input
                className="from_input"
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={onInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="from_label" htmlFor="description">
                Description:
              </label>
              <textarea
                id="description"
                className="from_input"
                name="description"
                value={description}
                onChange={onInputChange}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="from_label" htmlFor="seller">
                Shop Name:
              </label>
              <select
                id="seller"
                className="from_input"
                name="seller"
                value={seller} // Ensuring seller is being set correctly
                onChange={onInputChange}
                required
              >
                <option value="">Select Shop</option>
                <option value="Fabric Avenue">Fabric Avenue</option>
                <option value="Toybox Treasures">Toybox Treasures</option>
                <option value="Glow & Grace">Glow & Grace</option>
                <option value="GearUp Sports">GearUp Sports</option>
                <option value="Paper & Prose">Paper & Prose</option>
              </select>
            </div>

            <div className="form-group">
              <label className="from_label" htmlFor="image">
                Image:
              </label>
              <input
                className="from_input"
                type="file"
                id="image"
                name="image"
                onChange={onInputChange}
              />
              {previewUrl && (
                <div className="image-preview">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="image_preview"
                  />
                </div>
              )}
            </div>

            <button type="submit" className="from_btn">
              {id ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
