import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

const API = "http://localhost:5001/api";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get(`${API}/products/seller/${user.id}`),
        axios.get(`${API}/orders/seller/${user.id}`)
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API}/orders/${orderId}`, { status });
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status } : o
      ));
    } catch (error) {
      alert("Failed to update order");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60 }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Seller Dashboard</h1>
        <Link to="/dashboard/add" style={styles.addBtn}>+ Add Product</Link>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3>{products.length}</h3>
          <p>Total Products</p>
        </div>
        <div style={styles.statCard}>
          <h3>{orders.length}</h3>
          <p>Total Orders</p>
        </div>
      </div>

      {/* Products */}
      <h2 style={styles.sectionTitle}>My Products</h2>
      {products.length === 0 ? (
        <p>No products yet. <Link to="/dashboard/add">Add your first product</Link></p>
      ) : (
        <div style={styles.productGrid}>
          {products.map(p => (
            <div key={p.id} style={styles.productCard}>
              <img src={p.image || "https://via.placeholder.com/150"} alt={p.title} style={styles.productImg} />
              <div style={styles.productInfo}>
                <h4>{p.title}</h4>
                <p>৳{p.price}</p>
                <span style={{ ...styles.status, background: p.status === "active" ? "#4caf50" : "#999" }}>
                  {p.status}
                </span>
                <button onClick={() => deleteProduct(p.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders */}
      <h2 style={styles.sectionTitle}>Orders Received</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div style={styles.orderList}>
          {orders.map(o => (
            <div key={o.id} style={styles.orderCard}>
              <div>
                <strong>{o.buyer_name}</strong> ordered <strong>{o.product_title}</strong>
                <span style={styles.orderPrice}>৳{o.total_price}</span>
              </div>
              <div>
                <span style={{ ...styles.status, background: getStatusColor(o.status) }}>
                  {o.status}
                </span>
                <select 
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                  style={styles.statusSelect}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    pending: "#ff9800",
    confirmed: "#2196f3",
    shipped: "#9c27b0",
    delivered: "#4caf50",
    cancelled: "#f44336"
  };
  return colors[status] || "#999";
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  addBtn: {
    background: "#1a73e8",
    color: "white",
    padding: "10px 20px",
    borderRadius: 6,
    textDecoration: "none",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 20,
    marginBottom: 40,
  },
  statCard: {
    background: "#f5f5f5",
    padding: "20px",
    borderRadius: 8,
    textAlign: "center",
  },
  sectionTitle: {
    margin: "30px 0 20px",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 20,
  },
  productCard: {
    border: "1px solid #eee",
    borderRadius: 8,
    padding: 15,
  },
  productImg: {
    width: "100%",
    height: 150,
    objectFit: "cover",
    borderRadius: 6,
  },
  productInfo: {
    marginTop: 10,
  },
  status: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 12,
    color: "white",
    fontSize: "0.8rem",
    marginRight: 8,
  },
  deleteBtn: {
    background: "#f44336",
    color: "white",
    border: "none",
    padding: "4px 12px",
    borderRadius: 4,
    cursor: "pointer",
    marginTop: 8,
  },
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  orderCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f9f9f9",
    padding: "15px",
    borderRadius: 8,
    flexWrap: "wrap",
  },
  orderPrice: {
    fontWeight: "bold",
    color: "#1a73e8",
    marginLeft: 10,
  },
  statusSelect: {
    marginLeft: 10,
    padding: "4px 8px",
    borderRadius: 4,
    border: "1px solid #ddd",
  },
};