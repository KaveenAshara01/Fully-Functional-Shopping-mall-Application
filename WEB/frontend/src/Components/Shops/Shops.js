import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AfterNav from "../Home/NavBar/AfterNav";
import Footer from "../Home/HomePages/Footer";
import "./Shops.css";
import clothsLogo from "./img/clothslogo.webp"; // Import your Fabric Avenue image
import beautilogo from "./img/beautilogo.jpg"; // Import your Glow & Grace image
import sportlogo from "./img/sportlogos.jpg"; // Import your GearUp Sports image
import bookslogo from "./img/bookslogo.webp"; // Import your Paper & Prose image
import toylogo from "./img/toylogo.jpg"; // Import your Toybox Treasures image

const Shops = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8081/sellers")
      .then((response) => {
        setSellers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the sellers!", error);
        setError("There was an error fetching the sellers!");
        setLoading(false);
      });
  }, []);

  const handleShopClick = (seller) => {
    navigate(`/seller/${seller}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  
  const getSellerImage = (seller) => {
    switch (seller) {
      case "Fabric Avenue":
        return clothsLogo; 
      case "Glow & Grace":
        return beautilogo; 
      case "GearUp Sports":
        return sportlogo; 
      case "Paper & Prose":
        return bookslogo; 
      case "Toybox Treasures":
        return toylogo; 
     
      default:
        return null; 
    }
  };

  return (
    <div>
      <AfterNav />
      <div className="shops-container">
        <h2>Available Shops</h2>
        {sellers.length === 0 ? (
          <p>No shops available at the moment.</p>
        ) : (
          <div className="shop-cards">
            {sellers
              .filter((seller) => seller !== null && seller !== "") 
              .map((seller, index) => (
                <div
                  key={index}
                  className="product_cards"
                  onClick={() => handleShopClick(seller)}
                  style={{ cursor: "pointer" }}
                >
                  <h3 className="shop-name">{seller}</h3>{" "}
                  {}
                  {}
                  {getSellerImage(seller) && (
                    <img
                      src={getSellerImage(seller)}
                      alt={seller}
                      className="shop-logo"
                    />
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Shops;
