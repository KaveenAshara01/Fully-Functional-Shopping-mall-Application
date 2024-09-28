import React, { useEffect, useState } from "react";
import axios from "axios";
import AfterNav from "../Home/NavBar/AfterNav";
import Footer from "../Home/HomePages/Footer";
import "./Cart.css";
import { MdDelete } from "react-icons/md";
import { PayPalButtons } from "@paypal/react-paypal-js";
import EmptyCart from "./img/emty.jpg";
function MyCart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8081/cart/user/${userId}`
      );
      setCartItems(result.data);
      calculateTotalPrice(result.data);
    } catch (error) {
      console.error("Error loading cart items:", error);
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    try {
      await axios.put("http://localhost:8081/cart/update", {
        cartItemId,
        quantity,
      });
      loadCartItems();
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:8081/cart/delete/${cartItemId}`);
      loadCartItems();
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const applyCoupon = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8081/coupon/validate/${couponCode}`
      );
      const coupon = result.data;
      if (coupon) {
        if (totalPrice > coupon.price) {
          const discountAmount = Math.min(coupon.price, totalPrice);
          setDiscount(discountAmount);
        } else {
          alert("Coupon value exceeds the total price.");
        }
      } else {
        alert("Invalid coupon code.");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      alert("Error applying coupon. Please try again.");
    }
  };

  const finalprice = Math.max(totalPrice - discount, 0.01);
  const handleCheckout = async () => {
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      await handleInventoryUpdate(orderItems);

      
      window.location.href = `/payment?totalPrice=${finalprice}`;
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  const handleInventoryUpdate = async (orderItems) => {
    try {
      const updates = orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      
      await axios.post(
        "http://localhost:8081/products/update-quantity",
        updates
      );

      console.log("Quantity updated successfully");
    } catch (error) {
      console.error("Error updating product quantities:", error);
      alert("Error updating product quantities. Please try again.");
    }
  };

  return (
    <div>
      <AfterNav />
      <div className="body_container">
        {cartItems.length > 0 ? (
          <div className="cart_full_set">
            <div>
              <div className="cart_card_container">
                {cartItems.map((item) => (
                  <div key={item.id}>
                    <div className="cart_card">
                      <div className="left_colun">
                        <div>
                          <img
                            src={`http://localhost:8081/${item.product.imagePath}`}
                            alt={item.product.itemname}
                            className="cart_img"
                          />
                        </div>
                      </div>
                      <div className="rightcolum">
                        <div className="name_item">{item.product.itemname}</div>
                        <div className="price_itm">
                          Rs.{item.product.price}.00
                        </div>
                        <div className="acctin_cart">
                          <input
                            className="qty_iout"
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.id,
                                parseInt(e.target.value)
                              )
                            }
                          />
                          <MdDelete
                            className="dltbtn"
                            onClick={() => handleRemoveItem(item.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="price_box">
              <div className="coupnbox">
                <div className="coupn_set_nput">
                  <input
                    type="text"
                    className="form_input_copn"
                    name="couponcode"
                    placeholder="Add Coupon"
                    value={couponCode}
                    onChange={handleCouponChange}
                  />
                  <button
                    type="button"
                    className="aply_btn"
                    onClick={applyCoupon}
                  >
                    Apply
                  </button>
                </div>
              </div>
              <div>
                <p className="price_set">
                  Sub Price: <span>Rs.{totalPrice.toFixed(2)}</span>
                </p>
                <p className="price_set">
                  Discount: <span>Rs.{discount.toFixed(2)}</span>
                </p>
              </div>
              <h3 className="totprice">
                Total Price: Rs.{finalprice.toFixed(2)}
              </h3>
              <button
                className="btn_checkout bn_checkout_btn"
                onClick={() =>(window.location.href = `/payment?totalPrice=${finalprice}`)}
              >
                Pay now
              </button>
             

              <hr className="hr_change" />
              <div className="paypal-button-container">
                <PayPalButtons
                  createOrder={(data, actions) => {
                    if (finalprice <= 0) {
                      alert("The total price must be greater than zero.");
                      return;
                    }
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "USD",
                            value: finalprice.toFixed(2),
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    await actions.order.capture();
                    alert("Payment Successful!");
                    
                  }}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    alert("Payment failed. Please try again.");
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="emtybox_cart">
            <img src={EmptyCart} className="empty_cart" alt="emty" />
            <h3 className="empty topic">Your Cart Is Empty</h3>
            <button
              className="from_btn"
              onClick={() => (window.location.href = "/productoage")}
            >
              Shop Now
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MyCart;
