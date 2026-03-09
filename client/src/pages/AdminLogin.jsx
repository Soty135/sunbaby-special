import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ margin: '0 auto', height: '3rem', width: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#fee2e2' }}>
            <span style={{ fontSize: '1.5rem' }}>👨‍🍳</span>
          </div>
          <h2 style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '1.875rem', fontWeight: '800', color: '#111827' }}>
            Admin Login
          </h2>
          <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            Access admin dashboard to manage menu and orders
          </p>
        </div>
        
        <form style={{ marginTop: '2rem' }} onSubmit={handleSubmit}>
          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '1rem' }}>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                style={{ appearance: 'none', position: 'relative', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem 0.375rem 0 0', fontSize: '0.875rem', color: '#111827' }}
                placeholder="Admin email"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div style={{ marginTop: '-1px' }}>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                style={{ appearance: 'none', position: 'relative', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0 0 0.375rem 0.375rem', fontSize: '0.875rem', color: '#111827' }}
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', padding: '0.5rem 1rem', border: 'none', fontSize: '0.875rem', fontWeight: '500', borderRadius: '0.375rem', color: 'white', backgroundColor: '#dc2626', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign in to Admin'}
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/" style={{ color: '#059669', textDecoration: 'none', fontSize: '0.875rem' }}>
              ← Back to Main Site
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;