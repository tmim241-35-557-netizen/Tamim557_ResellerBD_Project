import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

const API = "http://localhost:5001/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    delivery_address: user?.address || "",
    phone: user?.phone || "",
    payment_method: "Cash on Delivery",
  });

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <h2>Your cart is empty</h2>
        <Link to="/products" style={styles.browseBtn}>Browse Products</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!orderData.delivery_address) {
      alert("Please enter delivery address");
      return;
    }

    setLoading(true);

    try {
      // Create order for each product
      for (const item of items) {
        await axios.post(`${API}/orders`, {
          buyer_id: user.id,
          product_id: item.id,
          seller_id: item.seller_id,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          delivery_address: orderData.delivery_address,
          phone: orderData.phone || user.phone,
          payment_method: orderData.payment_method,
        });
      }

      // Clear cart
      clearCart();
      
      alert("🎉 Order placed successfully!");
      navigate("/orders");

    } catch (error) {
      console.log("Order error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>

      <div style={styles.checkoutWrapper}>
        {/* Order Summary */}
        <div style={styles.orderSummary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          
          {items.map((item) => (
            <div key={item.id} style={styles.orderItem}>
              <img 
                src={item.image || "https://via.placeholder.com/60x60?text=No+Image"} 
                alt={item.title}
                style={styles.itemImage}
              />
              <div style={styles.itemDetails}>
                <div style={styles.itemName}>{item.title}</div>
                <div style={styles.itemMeta}>
                  ৳{item.price} × {item.quantity}
                </div>
              </div>
              <div style={styles.itemSubtotal}>
                ৳{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          <div style={styles.summaryDivider}></div>

          <div style={styles.totalRow}>
            <span>Total Items:</span>
            <span>{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
          </div>
          <div style={{ ...styles.totalRow, fontWeight: "bold", fontSize: "1.2rem" }}>
            <span>Total Amount:</span>
            <span style={{ color: "#1a73e8" }}>৳{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Form */}
        <div style={styles.deliveryForm}>
          <h3 style={styles.formTitle}>Delivery Information</h3>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                type="text" 
                value={user?.name || ""}
                disabled
                style={{ ...styles.input, background: "#f5f5f5" }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input 
                type="email" 
                value={user?.email || ""}
                disabled
                style={{ ...styles.input, background: "#f5f5f5" }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number *</label>
              <input 
                type="text" 
                name="phone"
                value={orderData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Delivery Address *</label>
              <textarea 
                name="delivery_address"
                value={orderData.delivery_address}
                onChange={handleChange}
                placeholder="Enter your full delivery address"
                required
                rows="3"
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Method</label>
              <select 
                name="payment_method"
                value={orderData.payment_method}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={styles.placeOrderBtn}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <Link to="/cart" style={styles.backToCart}>
              ← Back to Cart
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: 30,
    color: "#333",
  },
  emptyContainer: {
    textAlign: "center",
    padding: "60px 20px",
  },
  browseBtn: {
    display: "inline-block",
    background: "#1a73e8",
    color: "white",
    padding: "12px 30px",
    borderRadius: 8,
    textDecoration: "none",
    marginTop: 20,
  },
  checkoutWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: 30,
  },
  orderSummary: {
    background: "#f8f9fa",
    padding: "25px",
    borderRadius: 8,
  },
  summaryTitle: {
    marginTop: 0,
    marginBottom: 20,
    fontSize: "1.2rem",
    color: "#333",
  },
  orderItem: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  itemImage: {
    width: 50,
    height: 50,
    objectFit: "cover",
    borderRadius: 6,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: "0.95rem",
  },
  itemMeta: {
    fontSize: "0.85rem",
    color: "#666",
  },
  itemSubtotal: {
    fontWeight: "bold",
    color: "#1a73e8",
  },
  summaryDivider: {
    borderTop: "2px solid #ddd",
    margin: "15px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0",
  },
  deliveryForm: {
    background: "white",
    padding: "25px",
    borderRadius: 8,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  formTitle: {
    marginTop: 0,
    marginBottom: 20,
    fontSize: "1.2rem",
    color: "#333",
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: "0.95rem",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: "1rem",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    resize: "vertical",
  },
  placeOrderBtn: {
    width: "100%",
    padding: "14px",
    background: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  backToCart: {
    display: "block",
    textAlign: "center",
    color: "#666",
    textDecoration: "none",
    marginTop: 12,
  },
};