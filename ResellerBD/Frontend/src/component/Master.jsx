// Master.jsx - Main layout wrapper component
import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Master({ children }) {
  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
};