import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import axios from "axios";

const API = "http://localhost:5001/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data.slice(0, 8));
      setLoading(false);
    } catch (error) {
      console.log("Error loading products:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Buy & Sell Second-Hand Items</h1>
          <p style={styles.heroSub}>
            The largest student marketplace in Bangladesh
          </p>
          <Link to="/products" style={styles.heroBtn}>
            Browse Products
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section style={styles.section}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>No products yet. Check back later!</p>
          ) : (
            <div style={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 30 }}>
            <Link to="/products" style={styles.viewAllBtn}>
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ ...styles.section, backgroundColor: "#f9f9f9" }}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
          <div style={styles.categoryGrid}>
            {["Electronics", "Furniture", "Books", "Clothing", "Vehicles", "Others"].map((cat) => (
              <Link key={cat} to={`/products?category=${cat}`} style={styles.categoryCard}>
                <span style={styles.categoryIcon}>📦</span>
                <span>{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    background: "linear-gradient(135deg, #1a73e8, #0d47a1)",
    padding: "80px 20px",
    textAlign: "center",
    color: "white",
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "2.5rem",
    marginBottom: 15,
  },
  heroSub: {
    fontSize: "1.1rem",
    marginBottom: 30,
    opacity: 0.9,
  },
  heroBtn: {
    background: "white",
    color: "#1a73e8",
    padding: "12px 40px",
    borderRadius: 30,
    textDecoration: "none",
    fontWeight: "bold",
    display: "inline-block",
  },
  section: {
    padding: "60px 20px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    marginBottom: 30,
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 25,
    maxWidth: 1200,
    margin: "0 auto",
  },
  viewAllBtn: {
    color: "#1a73e8",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 20,
    maxWidth: 800,
    margin: "0 auto",
  },
  categoryCard: {
    background: "white",
    padding: "25px 15px",
    borderRadius: 10,
    textAlign: "center",
    textDecoration: "none",
    color: "#333",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "transform 0.2s",
  },
  categoryIcon: {
    fontSize: "2rem",
    display: "block",
    marginBottom: 8,
  },
};