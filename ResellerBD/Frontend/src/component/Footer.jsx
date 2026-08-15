import React from "react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          <div>
            <h3 style={styles.brand}>ResellerBD</h3>
            <p style={styles.desc}>
              Bangladesh's student marketplace for buying and selling 
              second-hand items. 
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul style={styles.list}>
              <li><a href="/products" style={styles.link}>Browse Products</a></li>
              <li><a href="/register" style={styles.link}>Sell an Item</a></li>
              <li><a href="/" style={styles.link}>How it Works</a></li>
            </ul>
          </div>
          <div>
            <h4>Payment Methods</h4>
            <ul style={styles.list}>
              <li>bKash</li>
              <li>Nagad</li>
              <li>Rocket</li>
              <li>Cash on Delivery</li>
            </ul>
          </div>
        </div>
        <div style={styles.bottom}>
          <span>© {new Date().getFullYear()} ResellerBD</span>
          <span>Made with ❤️ in Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#1a1a2e",
    color: "#eaf5ef",
    padding: "40px 20px 20px",
    marginTop: "auto",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 30,
    marginBottom: 30,
  },
  brand: {
    fontSize: "1.5rem",
    color: "#1a73e8",
  },
  desc: {
    maxWidth: 300,
    fontSize: "0.9rem",
    color: "#b7c6be",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    color: "#b7c6be",
    textDecoration: "none",
  },
  bottom: {
    borderTop: "1px solid #333",
    paddingTop: 20,
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    color: "#888",
    flexWrap: "wrap",
  },
};