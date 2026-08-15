import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  const handleCheckout = () => {
    if (!user) {
      alert("Please login first to checkout");
      navigate("/login");
      return;
    }
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2>Your Cart is Empty</h2>
        <p>Browse products and add items you want to buy</p>
        <Link to="/products" style={styles.browseBtn}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>
      
      <div style={styles.cartWrapper}>
        <div style={styles.itemsList}>
          {items.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              <img 
                src={item.image || "https://via.placeholder.com/100x100?text=No+Image"} 
                alt={item.title}
                style={styles.itemImage}
              />
              
              <div style={styles.itemInfo}>
                <Link to={`/products/${item.id}`} style={styles.itemTitle}>
                  {item.title}
                </Link>
                <span style={styles.itemPrice}>৳{item.price}</span>
                <span style={styles.itemCategory}>{item.category}</span>
              </div>

              <div style={styles.itemControls}>
                <div style={styles.quantityControls}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={styles.qtyBtn}
                  >
                    -
                  </button>
                  <span style={styles.qtyDisplay}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>
                
                <div style={styles.itemTotal}>
                  ৳{(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          
          <div style={styles.summaryRow}>
            <span>Items ({totalItems})</span>
            <span>৳{totalPrice.toFixed(2)}</span>
          </div>
          
          <div style={styles.summaryRow}>
            <span>Delivery</span>
            <span style={{ color: "#4caf50" }}>Free</span>
          </div>
          
          <div style={styles.summaryDivider}></div>
          
          <div style={{ ...styles.summaryRow, fontWeight: "bold", fontSize: "1.2rem" }}>
            <span>Total</span>
            <span>৳{totalPrice.toFixed(2)}</span>
          </div>

          <button onClick={handleCheckout} style={styles.checkoutBtn}>
            Proceed to Checkout
          </button>

          <Link to="/products" style={styles.continueBtn}>
            Continue Shopping
          </Link>
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
    padding: "80px 20px",
    maxWidth: 400,
    margin: "0 auto",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: 20,
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
  cartWrapper: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 30,
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  cartItem: {
    display: "grid",
    gridTemplateColumns: "100px 1fr auto",
    gap: 20,
    padding: "15px",
    background: "white",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    alignItems: "center",
  },
  itemImage: {
    width: "100%",
    height: 100,
    objectFit: "cover",
    borderRadius: 6,
  },
  itemInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  itemTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#333",
    textDecoration: "none",
  },
  itemPrice: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#1a73e8",
  },
  itemCategory: {
    fontSize: "0.85rem",
    color: "#888",
  },
  itemControls: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 10,
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyDisplay: {
    fontSize: "1rem",
    minWidth: 30,
    textAlign: "center",
  },
  itemTotal: {
    fontWeight: "bold",
    fontSize: "1rem",
    color: "#333",
  },
  removeBtn: {
    background: "none",
    border: "none",
    color: "#e53935",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  summary: {
    background: "#f8f9fa",
    padding: "25px",
    borderRadius: 8,
    alignSelf: "start",
    position: "sticky",
    top: 80,
  },
  summaryTitle: {
    marginTop: 0,
    marginBottom: 20,
    fontSize: "1.2rem",
    color: "#333",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    color: "#555",
  },
  summaryDivider: {
    borderTop: "1px solid #ddd",
    margin: "12px 0",
  },
  checkoutBtn: {
    width: "100%",
    padding: "12px",
    background: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 10,
  },
  continueBtn: {
    display: "block",
    textAlign: "center",
    color: "#1a73e8",
    textDecoration: "none",
    marginTop: 12,
    fontSize: "0.95rem",
  },
};