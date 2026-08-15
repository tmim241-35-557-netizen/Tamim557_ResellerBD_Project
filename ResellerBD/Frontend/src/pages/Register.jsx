import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5001/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    district: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API}/auth/register`, form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join ResellerBD today</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="District"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            style={styles.input}
          />
          
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={styles.input}
          >
            <option value="customer">Customer (Buy products)</option>
            <option value="seller">Seller (Sell products)</option>
          </select>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    padding: "20px",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: 420,
  },
  title: {
    textAlign: "center",
    marginBottom: 5,
    fontSize: "1.8rem",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: 12,
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: 5,
  },
  error: {
    background: "#fee",
    color: "#c00",
    padding: "10px",
    borderRadius: 6,
    marginBottom: 15,
    fontSize: "0.9rem",
  },
  footer: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  link: {
    color: "#1a73e8",
    textDecoration: "none",
  },
};