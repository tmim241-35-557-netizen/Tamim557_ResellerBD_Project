// MyOrders.jsx - User orders page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

const API = 'http://localhost:5001/api';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders/buyer/${user.id}`);
      setOrders(response.data);
    } catch (error) {
      console.log('Error loading orders:', error);
    } finally {
      setLoading(false);
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
    return <div style={styles.loading}>Loading orders...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📦</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" style={styles.browseBtn}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div style={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <span style={styles.orderId}>Order #{order.id}</span>
                <span
                  style={{
                    ...styles.status,
                    background: getStatusColor(order.status),
                  }}
                >
                  {order.status}
                </span>
                <span style={styles.orderDate}>
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div style={styles.orderBody}>
                <img
                  src={
                    order.product_image ||
                    'https://via.placeholder.com/80x80?text=No+Image'
                  }
                  alt={order.product_title}
                  style={styles.productImage}
                />
                <div style={styles.orderDetails}>
                  <Link
                    to={`/products/${order.product_id}`}
                    style={styles.productTitle}
                  >
                    {order.product_title}
                  </Link>
                  <div style={styles.orderMeta}>
                    <span>Seller: {order.seller_name}</span>
                    <span>Qty: {order.quantity}</span>
                    <span style={styles.orderTotal}>
                      ৳{order.total_price}
                    </span>
                  </div>
                  <div style={styles.orderAddress}>
                    📍 {order.delivery_address}
                  </div>
                  <div style={styles.orderPayment}>
                    💳 {order.payment_method}
                  </div>
                </div>
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
    maxWidth: 900,
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: 30,
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    padding: 60,
    fontSize: '1.2rem',
    color: '#666',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: 20,
  },
  browseBtn: {
    display: 'inline-block',
    background: '#1a73e8',
    color: 'white',
    padding: '12px 30px',
    borderRadius: 8,
    textDecoration: 'none',
    marginTop: 20,
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  orderCard: {
    background: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    background: '#f8f9fa',
    borderBottom: '1px solid #eee',
    flexWrap: 'wrap',
    gap: 10,
  },
  orderId: {
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    padding: '4px 14px',
    borderRadius: 12,
    color: 'white',
    fontSize: '0.85rem',
    textTransform: 'capitalize',
  },
  orderDate: {
    color: '#888',
    fontSize: '0.9rem',
  },
  orderBody: {
    display: 'flex',
    padding: '20px',
    gap: 20,
    alignItems: 'flex-start',
  },
  productImage: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 6,
  },
  orderDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    textDecoration: 'none',
  },
  orderMeta: {
    display: 'flex',
    gap: 15,
    marginTop: 8,
    color: '#666',
    fontSize: '0.95rem',
    flexWrap: 'wrap',
  },
  orderTotal: {
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  orderAddress: {
    marginTop: 8,
    color: '#666',
    fontSize: '0.9rem',
  },
  orderPayment: {
    marginTop: 4,
    color: '#888',
    fontSize: '0.9rem',
  },
};