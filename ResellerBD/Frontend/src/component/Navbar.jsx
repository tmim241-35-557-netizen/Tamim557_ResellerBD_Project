import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header style={styles.navbar}>
      <div style={styles.container}>
        <NavLink to="/" style={styles.brand}>
          Reseller<span style={styles.brandDot}>BD</span>
        </NavLink>

        <nav style={styles.navLinks}>
          <NavLink to="/" style={styles.link} end>Home</NavLink>
          <NavLink to="/products" style={styles.link}>Browse</NavLink>
          
          {user?.role === "seller" && (
            <NavLink to="/dashboard" style={styles.link}>Dashboard</NavLink>
          )}
          
          {user && (
            <NavLink to="/orders" style={styles.link}>Orders</NavLink>
          )}
          
          <NavLink to="/cart" style={{ ...styles.link, position: "relative" }}>
            Cart
            {items.length > 0 && (
              <span style={styles.badge}>{items.length}</span>
            )}
          </NavLink>

          {user ? (
            <>
              <span style={styles.userName}>Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={styles.link}>Login</NavLink>
              <NavLink to="/register" style={styles.signupLink}>Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  navbar: {
    background: "#fff",
    borderBottom: "1px solid #eee",
    padding: "12px 20px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textDecoration: "none",
    color: "#1a73e8",
  },
  brandDot: {
    color: "#e53935",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  link: {
    textDecoration: "none",
    color: "#333",
    padding: "6px 10px",
    borderRadius: 4,
    transition: "color 0.2s",
  },
  signupLink: {
    background: "#1a73e8",
    color: "white",
    padding: "6px 16px",
    borderRadius: 20,
    textDecoration: "none",
  },
  userName: {
    color: "#1a73e8",
    padding: "6px 10px",
    fontSize: "0.9rem",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    color: "#e53935",
    cursor: "pointer",
    fontSize: "0.9rem",
    padding: "6px 10px",
  },
  badge: {
    background: "#e53935",
    color: "white",
    borderRadius: "50%",
    padding: "1px 7px",
    fontSize: "0.7rem",
    marginLeft: 4,
  },
};