// SellInshophub.jsx - Seller hub/dashboard page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

const API = 'http://localhost:5001/api';

export default function SellInshophub() {
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
        axios.get(`${API}/orders/seller/${user.id}`),
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API}/orders/${orderId}`, { status });
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (error) {
      alert('Failed to update order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336',
    };
    return colors[status] || '#999';
  };

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Sell Inshophub</h1>
        <div style={styles.headerActions}>
          <Link to="/dashboard/add" style={styles.addBtn}>
            + Add Product
          </Link>
        </div>
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
        <div style={styles.statCard}>
          <h3>
            {orders.filter((o) => o.status === 'pending').length}
          </h3>
          <p>Pending Orders</p>
        </div>
      </div>

      {/* Orders Section */}
      <h2 style={styles.sectionTitle}>Orders Received</h2>
      {orders.length === 0 ? (
        <p style={styles.emptyText}>No orders yet.</p>
      ) : (
        <div style={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderInfo}>
                <div>
                  <strong>{order.buyer_name}</strong> ordered{' '}
                  <strong>{order.product_title}</strong>
                </div>
                <div style={styles.orderMeta}>
                  <span style={styles.orderPrice}>৳{order.total_price}</span>
                  <span style={styles.orderQty}>Qty: {order.quantity}</span>
                </div>
              </div>
              <div style={styles.orderActions}>
                <span
                  style={{
                    ...styles.statusBadge,
                    background: getStatusColor(order.status),
                  }}
                >
                  {order.status}
                </span>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(order.id, e.target.value)
                  }
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

      {/* Products Section */}
      <h2 style={styles.sectionTitle}>My Products</h2>
      {products.length === 0 ? (
        <p style={styles.emptyText}>
          No products yet.{' '}
          <Link to="/dashboard/add" style={styles.link}>
            Add your first product
          </Link>
        </p>
      ) : (
        <div style={styles.productGrid}>
          {products.map((product) => (
            <div key={product.id} style={styles.productCard}>
              <img
                src={
                  product.image ||
                  'https://via.placeholder.com/200x150?text=No+Image'
                }
                alt={product.title}
                style={styles.productImg}
              />
              <div style={styles.productInfo}>
                <h4>{product.title}</h4>
                <p style={styles.productPrice}>৳{product.price}</p>
                <span
                  style={{
                    ...styles.statusBadge,
                    background:
                      product.status === 'active' ? '#4caf50' : '#999',
                  }}
                >
                  {product.status}
                </span>
                <button
                  onClick={() => deleteProduct(product.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    flexWrap: 'wrap',
    gap: 15,
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: 10,
  },
  addBtn: {
    background: '#1a73e8',
    color: 'white',
    padding: '10px 20px',
    borderRadius: 6,
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 20,
    marginBottom: 40,
  },
  statCard: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    margin: '30px 0 20px',
    color: '#333',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  link: {
    color: '#1a73e8',
    textDecoration: 'none',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20,
  },
  productCard: {
    border: '1px solid #eee',
    borderRadius: 8,
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
  },
  productImg: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
  },
  productInfo: {
    padding: '15px',
  },
  productPrice: {
    fontWeight: 'bold',
    color: '#1a73e8',
    fontSize: '1.1rem',
    margin: '5px 0',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '2px 12px',
    borderRadius: 12,
    color: 'white',
    fontSize: '0.8rem',
    textTransform: 'capitalize',
    marginTop: 5,
  },
  deleteBtn: {
    background: '#f44336',
    color: 'white',
    border: 'none',
    padding: '5px 14px',
    borderRadius: 4,
    cursor: 'pointer',
    marginTop: 8,
    fontSize: '0.85rem',
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  orderCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f9f9fa',
    padding: '15px 20px',
    borderRadius: 8,
    flexWrap: 'wrap',
    gap: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderMeta: {
    display: 'flex',
    gap: 15,
    marginTop: 4,
    color: '#666',
    fontSize: '0.9rem',
  },
  orderPrice: {
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  orderQty: {
    color: '#888',
  },
  orderActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  statusSelect: {
    padding: '4px 8px',
    borderRadius: 4,
    border: '1px solid #ddd',
    fontSize: '0.85rem',
  },
  loading: {
    textAlign: 'center',
    padding: 60,
    fontSize: '1.2rem',
    color: '#666',
  },
};