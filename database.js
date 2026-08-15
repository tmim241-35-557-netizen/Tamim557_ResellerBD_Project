// database.js - SQLite Database (No installation needed!)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file
const db = new sqlite3.Database(path.join(__dirname, 'resellerbd.db'));

// Create all tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      district TEXT,
      role TEXT DEFAULT 'customer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      category TEXT,
      condition TEXT DEFAULT 'Good',
      district TEXT,
      image TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      seller_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      total_price REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      delivery_address TEXT NOT NULL,
      phone TEXT,
      payment_method TEXT DEFAULT 'Cash on Delivery',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Insert default admin
  db.run(`
    INSERT OR IGNORE INTO users (name, email, password, role) 
    VALUES ('Admin', 'admin@resellerbd.com', 'admin123', 'admin')
  `);

  // Insert sample products for testing
  db.run(`
    INSERT OR IGNORE INTO products (seller_id, title, description, price, category, condition, district, image) 
    VALUES 
      (1, 'Natural Honey 500g', 'Pure, real and natural honey with no additives', 800, 'Others', 'New', 'Dhaka', 'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=900&q=80'),
      (1, 'Gaming Chair', 'Ergonomic gaming chair, adjustable', 15000, 'Furniture', 'New', 'Chittagong', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'),
      (1, 'Data Structures Book', 'University textbook, like new', 500, 'Books', 'Good', 'Dhaka', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80')
  `);
});

console.log('✅ Database ready!');

module.exports = db;