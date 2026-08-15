// CartDependencies.jsx - Enhanced cart with dependencies and utilities
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartDependenciesContext = createContext();

export function useCartDependencies() {
  return useContext(CartDependenciesContext);
}

export function CartDependenciesProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart_dependencies');
    const storedWishlist = localStorage.getItem('wishlist');
    const storedSaved = localStorage.getItem('saved_items');

    if (storedCart) setCartItems(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    if (storedSaved) setSavedItems(JSON.parse(storedSaved));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart_dependencies', JSON.stringify(cartItems));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    localStorage.setItem('saved_items', JSON.stringify(savedItems));

    // Calculate total savings
    const savings = cartItems.reduce((sum, item) => {
      if (item.original_price && item.original_price > item.price) {
        return sum + (item.original_price - item.price) * item.quantity;
      }
      return sum;
    }, 0);
    setTotalSavings(savings);
  }, [cartItems, wishlist, savedItems]);

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Saved items operations
  const saveForLater = (item) => {
    setSavedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, { ...item, savedAt: new Date().toISOString() }];
    });
  };

  const isSaved = (itemId) => {
    return savedItems.some((item) => item.id === itemId);
  };

  // Calculate totals
  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalSavings = () => totalSavings;

  const value = {
    cartItems,
    wishlist,
    savedItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist,
    saveForLater,
    isSaved,
    getTotalItems,
    getTotalPrice,
    getTotalSavings,
  };

  return (
    <CartDependenciesContext.Provider value={value}>
      {children}
    </CartDependenciesContext.Provider>
  );
}