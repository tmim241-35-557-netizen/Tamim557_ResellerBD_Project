import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

const API = "http://localhost:5001/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.log("Error loading product:", error);
      alert("Product not found");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login first to add items to cart");
      navigate("/login");
      return;
    }
    addToCart(product, quantity);
    alert("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("Please login first to buy");
      navigate("/login");
      return;
    }
    // Add to cart and go to checkout
    addToCart(product, quantity);
    navigate("/checkout");
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!product) {
    return <div style={styles.loading}>Product not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.backLink}>
        <Link to="/products" style={styles.backLinkText}>← Back to Products</Link>
      </div>

      <div style={styles.productWrapper}>
        {/* Product Image */}
        <div style={styles.imageSection}>
          <img 
            src={product.image || "https://via.placeholder.com/500x400?text=No+Image"} 
            alt={product.title}
            style={styles.mainImage}
          />
        </div>

        {/* Product Info */}
        <div style={styles.infoSection}>
          <span style={styles.category}>{product.category}</span>
          <h1 style={styles.title}>{product.title}</h1>
          
          <div style={styles.priceWrapper}>
            <span style={styles.price}>৳{product.price}</span>
            {product.original_price && (
              <span style={styles.oldPrice}>৳{product.original_price}</span>
            )}
            {product.original_price && product.original_price > product.price && (
              <span style={styles.discountBadge}>
                -{Math.round(100 - (product.price / product.original_price) * 100)}%
              </span>
            )}
          </div>

          <div style={styles.sellerInfo}>
            <span>👤 Seller: <strong>{product.seller_name}</strong></span>
            <span>📍 {product.district || "Location not specified"}</span>
            <span>📞 {product.seller_phone || "Contact seller"}</span>
          </div>

          <div style={styles.conditionWrapper}>
            <span style={styles.conditionLabel}>Condition:</span>
            <span style={{ ...styles.conditionBadge, background: getConditionColor(product.condition) }}>
              {product.condition || "Good"}
            </span>
          </div>

          <div style={styles.description}>
            <h3>Description</h3>
            <p>{product.description || "No description available"}</p>
          </div>

          {/* Quantity Selector */}
          <div style={styles.quantityWrapper}>
            <label style={styles.quantityLabel}>Quantity:</label>
            <div style={styles.quantityControls}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.qtyBtn}
              >
                -
              </button>
              <span style={styles.qtyDisplay}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={styles.qtyBtn}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button onClick={handleAddToCart} style={styles.cartBtn}>
              🛒 Add to Cart
            </button>
            <button onClick={handleBuyNow} style={styles.buyBtn}>
              Buy Now
            </button>
          </div>

          {user && user.id === product.seller_id && (
            <div style={styles.sellerNote}>
              <p>⚠️ You are the seller of this product</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getConditionColor(condition) {
  const colors = {
    "New": "#4caf50",
    "Like New": "#8bc34a",
    "Good": "#ff9800",
    "Fair": "#f44336"
  };
  return colors[condition] || "#999";
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "20px",
  },
  backLink: {
    marginBottom: 20,
  },
  backLinkText: {
    color: "#1a73e8",
    textDecoration: "none",
    fontSize: "1rem",
  },
  loading: {
    textAlign: "center",
    padding: 60,
    fontSize: "1.2rem",
    color: "#666",
  },
  productWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 40,
  },
  imageSection: {
    position: "relative",
  },
  mainImage: {
    width: "100%",
    maxHeight: 500,
    objectFit: "cover",
    borderRadius: 8,
  },
  infoSection: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  category: {
    fontSize: "0.9rem",
    color: "#1a73e8",
    background: "#e3f2fd",
    padding: "4px 12px",
    borderRadius: 12,
    display: "inline-block",
    width: "fit-content",
  },
  title: {
    fontSize: "2rem",
    margin: 0,
    color: "#333",
  },
  priceWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginTop: 5,
  },
  price: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1a73e8",
  },
  oldPrice: {
    fontSize: "1.2rem",
    textDecoration: "line-through",
    color: "#999",
  },
  discountBadge: {
    background: "#e53935",
    color: "white",
    padding: "2px 12px",
    borderRadius: 12,
    fontSize: "0.9rem",
  },
  sellerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    background: "#f5f5f5",
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: "0.95rem",
  },
  conditionWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  conditionLabel: {
    fontWeight: "bold",
    color: "#555",
  },
  conditionBadge: {
    padding: "3px 14px",
    borderRadius: 12,
    color: "white",
    fontSize: "0.85rem",
  },
  description: {
    borderTop: "1px solid #eee",
    paddingTop: 15,
  },
  quantityWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginTop: 5,
  },
  quantityLabel: {
    fontWeight: "bold",
    color: "#555",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
    fontSize: "1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyDisplay: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
  },
  actionButtons: {
    display: "flex",
    gap: 15,
    marginTop: 10,
  },
  cartBtn: {
    flex: 1,
    padding: "14px",
    background: "#fff",
    color: "#1a73e8",
    border: "2px solid #1a73e8",
    borderRadius: 8,
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buyBtn: {
    flex: 1,
    padding: "14px",
    background: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  sellerNote: {
    background: "#fff3cd",
    color: "#856404",
    padding: "10px 16px",
    borderRadius: 8,
    marginTop: 10,
  },
};