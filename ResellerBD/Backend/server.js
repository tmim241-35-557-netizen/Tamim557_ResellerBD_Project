// server.js - Complete backend with all routes
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 5001;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// ============ MIDDLEWARE ============
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5175",
  "http://localhost:5176",
  "http://127.0.0.1:5176",
  "http://localhost:5177",
  "http://127.0.0.1:5177",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === "Only image files are allowed") {
    return res.status(400).json({ error: err.message || "File upload failed" });
  }
  next(err);
});

// Create uploads folder
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============ HELPERS ============
const handleError = (res, err, msg = "Server error") => {
  console.error(err);
  res.status(500).json({ error: msg });
};

// ============ AUTH ROUTES ============

// Register
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, phone, address, district, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password required" });
  }

  db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
    if (err) return handleError(res, err);
    if (row) return res.status(400).json({ error: "Email already registered" });

    db.run(
      `INSERT INTO users (name, email, password, phone, address, district, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password, phone, address, district, role || "customer"],
      function(err) {
        if (err) return handleError(res, err);
        res.status(201).json({ 
          message: "Registration successful", 
          userId: this.lastID 
        });
      }
    );
  });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  db.get(
    "SELECT id, name, email, phone, address, district, role FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) return handleError(res, err);
      if (!row) return res.status(401).json({ error: "Invalid email or password" });
      res.json({ message: "Login successful", user: row });
    }
  );
});

// ============ PRODUCT ROUTES ============

// Get all products
app.get("/api/products", (req, res) => {
  db.all(
    `SELECT p.*, u.name as seller_name 
     FROM products p 
     JOIN users u ON p.seller_id = u.id 
     WHERE p.status = 'active'
     ORDER BY p.created_at DESC`,
    (err, rows) => {
      if (err) return handleError(res, err);
      res.json(rows);
    }
  );
});

// Get single product
app.get("/api/products/:id", (req, res) => {
  db.get(
    `SELECT p.*, u.name as seller_name, u.phone as seller_phone 
     FROM products p 
     JOIN users u ON p.seller_id = u.id 
     WHERE p.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) return handleError(res, err);
      if (!row) return res.status(404).json({ error: "Product not found" });
      res.json(row);
    }
  );
});

// Add product
app.post("/api/products", upload.single("imageFile"), (req, res) => {
  const { seller_id, title, description, price, original_price, category, condition, district, image } = req.body;
  const uploadedImage = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : image || null;

  if (!seller_id || !title || !price) {
    return res.status(400).json({ error: "Seller ID, title, and price required" });
  }

  db.run(
    `INSERT INTO products (seller_id, title, description, price, original_price, category, condition, district, image) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [seller_id, title, description, price, original_price, category, condition || "Good", district, uploadedImage],
    function(err) {
      if (err) return handleError(res, err);
      res.status(201).json({ 
        message: "Product added successfully", 
        productId: this.lastID,
        image: uploadedImage,
      });
    }
  );
});

// Get seller's products
app.get("/api/products/seller/:seller_id", (req, res) => {
  db.all(
    "SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC",
    [req.params.seller_id],
    (err, rows) => {
      if (err) return handleError(res, err);
      res.json(rows);
    }
  );
});

// Delete product
app.delete("/api/products/:id", (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id], function(err) {
    if (err) return handleError(res, err);
    if (this.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});

// ============ ORDER ROUTES ============

// Create order
app.post("/api/orders", (req, res) => {
  const { buyer_id, product_id, seller_id, quantity, total_price, delivery_address, phone, payment_method } = req.body;

  if (!buyer_id || !product_id || !seller_id || !total_price || !delivery_address) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO orders (buyer_id, product_id, seller_id, quantity, total_price, delivery_address, phone, payment_method) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [buyer_id, product_id, seller_id, quantity || 1, total_price, delivery_address, phone, payment_method || "Cash on Delivery"],
    function(err) {
      if (err) return handleError(res, err);
      res.status(201).json({ 
        message: "Order placed successfully", 
        orderId: this.lastID 
      });
    }
  );
});

// Get buyer's orders
app.get("/api/orders/buyer/:buyer_id", (req, res) => {
  db.all(
    `SELECT o.*, p.title as product_title, p.image as product_image, u.name as seller_name
     FROM orders o
     JOIN products p ON o.product_id = p.id
     JOIN users u ON o.seller_id = u.id
     WHERE o.buyer_id = ?
     ORDER BY o.created_at DESC`,
    [req.params.buyer_id],
    (err, rows) => {
      if (err) return handleError(res, err);
      res.json(rows);
    }
  );
});

// Get seller's orders
app.get("/api/orders/seller/:seller_id", (req, res) => {
  db.all(
    `SELECT o.*, p.title as product_title, p.image as product_image, u.name as buyer_name
     FROM orders o
     JOIN products p ON o.product_id = p.id
     JOIN users u ON o.buyer_id = u.id
     WHERE o.seller_id = ?
     ORDER BY o.created_at DESC`,
    [req.params.seller_id],
    (err, rows) => {
      if (err) return handleError(res, err);
      res.json(rows);
    }
  );
});

// Update order status
app.put("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  
  db.run("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], function(err) {
    if (err) return handleError(res, err);
    if (this.changes === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order updated successfully" });
  });
});

// ============ HEALTH CHECK ============
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "ResellerBD API is running",
    timestamp: new Date().toISOString()
  });
});

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`🚀 ResellerBD backend running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Database: resellerbd.db created in backend folder`);
});

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});