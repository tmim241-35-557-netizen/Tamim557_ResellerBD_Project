import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

const API = "http://localhost:5001/api";

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    original_price: "",
    category: "",
    condition: "Good",
    district: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.title || !form.price || !form.category) {
      alert("Title, price, and category are required!");
      return;
    }

    if (!user || !user.id) {
      alert("Please login as a seller first!");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries({
        ...form,
        seller_id: user.id,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
      }).forEach(([key, value]) => {
        if (value !== null && value !== "" && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      await axios.post(`${API}/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      alert("✅ Product added successfully!");
      navigate("/dashboard");

    } catch (error) {
      console.log("Add product error:", error);
      alert(error.response?.data?.error || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Add New Product</h1>
        <p style={styles.subtitle}>List your item for sale</p>
      </div>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter product title"
              required
              style={styles.input}
            />
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your product in detail"
              rows="4"
              style={styles.textarea}
            />
          </div>

          {/* Price */}
          <div style={styles.row}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Price (৳) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
                min="0"
                step="0.01"
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Original Price (৳)</label>
              <input
                type="number"
                name="original_price"
                value={form.original_price}
                onChange={handleChange}
                placeholder="Original price (optional)"
                min="0"
                step="0.01"
                style={styles.input}
              />
            </div>
          </div>

          {/* Category */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Books">Books</option>
              <option value="Clothing">Clothing</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Condition */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Condition</label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          {/* District */}
          <div style={styles.formGroup}>
            <label style={styles.label}>District</label>
            <input
              type="text"
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="Your location (e.g., Dhaka, Chittagong)"
              style={styles.input}
            />
          </div>

          {/* Image URL / Upload */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Image URL</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Paste image URL (optional)"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Upload photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              style={styles.fileInput}
            />
            {imageFile && (
              <div style={styles.fileName}>Selected: {imageFile.name}</div>
            )}
          </div>

          {/* Buttons */}
          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitBtn}
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    marginBottom: 30,
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    color: "#666",
    fontSize: "1rem",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  formGroup: {
    marginBottom: 20,
  },
  row: {
    display: "flex",
    gap: 15,
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: "0.95rem",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  fileInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 6,
    background: "#fafafa",
  },
  fileName: {
    marginTop: 8,
    color: "#1a73e8",
    fontSize: "0.9rem",
  },
  textarea: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: "1rem",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    resize: "vertical",
  },
  buttonGroup: {
    display: "flex",
    gap: 12,
    marginTop: 10,
  },
  submitBtn: {
    flex: 1,
    padding: "12px",
    background: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    background: "#f5f5f5",
    color: "#666",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: "1rem",
    cursor: "pointer",
  },
};