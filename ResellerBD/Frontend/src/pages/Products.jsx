import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import axios from "axios";

const API = "http://localhost:5001/api";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: searchParams.get("category") || "",
    search: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.log("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchCategory = !filter.category || p.category === filter.category;
    const matchSearch = !filter.search || 
      p.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      p.description?.toLowerCase().includes(filter.search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

  if (loading) return <div style={{ textAlign: "center", padding: 60 }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="Search products..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          style={styles.searchInput}
        />
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          style={styles.select}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: "center", padding: 40 }}>No products found</p>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "20px",
  },
  filterBar: {
    display: "flex",
    gap: 15,
    marginBottom: 30,
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    padding: "10px 16px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: "1rem",
    minWidth: 200,
  },
  select: {
    padding: "10px 16px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: "1rem",
    background: "white",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 25,
  },
};