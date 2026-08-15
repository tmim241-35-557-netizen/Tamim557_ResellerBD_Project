import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const discount = product.original_price && product.original_price > product.price
    ? Math.round(100 - (product.price / product.original_price) * 100)
    : null;

  return (
    <Link to={`/products/${product.id}`} style={styles.card}>
      {discount && (
        <div style={styles.discount}>-{discount}%</div>
      )}
      <img 
        src={product.image || "https://via.placeholder.com/300x200?text=No+Image"} 
        alt={product.title}
        style={styles.image}
      />
      <div style={styles.body}>
        <span style={styles.category}>{product.category}</span>
        <h4 style={styles.title}>{product.title}</h4>
        <div style={styles.priceRow}>
          <span style={styles.price}>৳{product.price}</span>
          {product.original_price && (
            <span style={styles.oldPrice}>৳{product.original_price}</span>
          )}
        </div>
        <div style={styles.location}>📍 {product.district}</div>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    border: "1px solid #eee",
    borderRadius: 8,
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    position: "relative",
  },
  discount: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "#e53935",
    color: "white",
    padding: "3px 10px",
    borderRadius: 12,
    fontSize: "0.8rem",
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: 200,
    objectFit: "cover",
  },
  body: {
    padding: "15px",
  },
  category: {
    fontSize: "0.8rem",
    color: "#1a73e8",
    background: "#e3f2fd",
    padding: "2px 10px",
    borderRadius: 12,
  },
  title: {
    margin: "8px 0",
    fontSize: "1rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 5,
  },
  price: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    color: "#1a73e8",
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#999",
    fontSize: "0.9rem",
  },
  location: {
    fontSize: "0.8rem",
    color: "#666",
  },
};