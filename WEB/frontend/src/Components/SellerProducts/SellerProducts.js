import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AfterNav from '../Home/NavBar/AfterNav';
import Footer from '../Home/HomePages/Footer';

const SellerProducts = () => {
  const { seller } = useParams();  // Get seller from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/productmanagement/seller/${seller}`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
        setError('There was an error fetching the products!');
        setLoading(false);
      });
  }, [seller]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }


  const addToCart = async (productId) => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const cartRequest = {
        userId: userId,
        productId: productId,
        quantity: 1,
      };

      await axios.post("http://localhost:8081/cart/add", cartRequest);
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };
  return (
    <div>
      {/* <h2>Products for Seller: {seller}</h2>
      {products.length === 0 ? (
        <p>No products found for this seller.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.itemname} - {product.price}
            </li>
          ))}
        </ul>
      )} */}









<AfterNav />
      <div className="body_container">
        <div>
          <div>
          <h2> {seller}</h2>
          </div>
        </div>
      
        {/* Product Display */}
        <div className="product_grid">
          {products.map((product) => (
            <div key={product.id} className="product_card">
              <div className="product_image">
                <img
                  src={`http://localhost:8081/${product.imagePath}`}
                  alt={product.itemname}
                  className="product_image"
                />
              </div>
              <div className="product_id">ID: {product.id}</div>
              <div className="flash_card_details">
                <div className="product_name">{product.itemname}</div>
                <div className="product_price">Rs.{product.price}.00</div>
                <div className="product_description">{product.description}</div>
                <div>
                  <button
                    className="product_action"
                    onClick={() => addToCart(product.id)}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerProducts;
