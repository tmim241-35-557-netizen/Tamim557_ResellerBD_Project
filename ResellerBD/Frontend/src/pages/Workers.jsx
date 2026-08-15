// Workers.jsx - Team/Workers page
import React from 'react';

export default function Workers() {
  const workers = [
    {
      id: 1,
      name: 'Md. Rahman',
      role: 'Full Stack Developer',
      image: 'https://via.placeholder.com/150x150?text=👤',
      bio: 'Leading the development of ResellerBD platform.',
    },
    {
      id: 2,
      name: 'Sadia Akter',
      role: 'UI/UX Designer',
      image: 'https://via.placeholder.com/150x150?text=👩',
      bio: 'Designing user-friendly interfaces for the marketplace.',
    },
    {
      id: 3,
      name: 'Kamal Hossain',
      role: 'Database Administrator',
      image: 'https://via.placeholder.com/150x150?text=👨',
      bio: 'Managing database architecture and optimization.',
    },
    {
      id: 4,
      name: 'Nadia Sultana',
      role: 'Quality Assurance',
      image: 'https://via.placeholder.com/150x150?text=👩',
      bio: 'Ensuring quality and testing all features.',
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Our Team</h1>
        <p style={styles.subtitle}>
          Meet the amazing people behind ResellerBD
        </p>
      </div>

      <div style={styles.grid}>
        {workers.map((worker) => (
          <div key={worker.id} style={styles.card}>
            <img
              src={worker.image}
              alt={worker.name}
              style={styles.image}
            />
            <div style={styles.content}>
              <h3 style={styles.name}>{worker.name}</h3>
              <span style={styles.role}>{worker.role}</span>
              <p style={styles.bio}>{worker.bio}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.joinSection}>
        <h2>Join Our Team</h2>
        <p>
          We're always looking for talented people to join our growing team.
        </p>
        <button style={styles.joinBtn}>Contact Us</button>
      </div>
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
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: 30,
    marginBottom: 50,
  },
  card: {
    background: 'white',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  image: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
  },
  content: {
    padding: '20px',
  },
  name: {
    margin: '0 0 5px 0',
    fontSize: '1.2rem',
    color: '#333',
  },
  role: {
    display: 'inline-block',
    background: '#e3f2fd',
    color: '#1a73e8',
    padding: '2px 14px',
    borderRadius: 12,
    fontSize: '0.85rem',
    marginBottom: 10,
  },
  bio: {
    color: '#666',
    fontSize: '0.95rem',
    margin: 0,
  },
  joinSection: {
    textAlign: 'center',
    padding: '40px',
    background: '#f8f9fa',
    borderRadius: 12,
  },
  joinBtn: {
    background: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '12px 40px',
    borderRadius: 6,
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: 10,
  },
};