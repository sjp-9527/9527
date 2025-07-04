import React, { useState } from 'react';
import API from '../api';
import { ThemeContext } from '../ThemeContext';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = React.useContext(ThemeContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setMsg('');
    
    try {
      const res = await API.post('/auth/login', { username, password });
      setMsg('登录成功');
      onLogin && onLogin(res.data.token, username);
    } catch (err) {
      setMsg(err.response?.data?.error || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: 20
    }}>
      <div style={{
        background: theme === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)',
        padding: 40,
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        minWidth: 320,
        maxWidth: 400,
        width: '100%'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: 30,
          color: theme === 'dark' ? '#eee' : '#333',
          fontSize: 28,
          fontWeight: 600
        }}>
          欢迎回来
        </h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="用户名"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: 16,
                backgroundColor: theme === 'dark' ? '#333' : '#fff',
                color: theme === 'dark' ? '#eee' : '#333',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
          
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="密码"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: 16,
                backgroundColor: theme === 'dark' ? '#333' : '#fff',
                color: theme === 'dark' ? '#eee' : '#333',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 8,
              border: 'none',
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: '#fff',
              transition: 'background-color 0.3s',
              marginTop: 10
            }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
          
          {msg && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 8,
              backgroundColor: msg.includes('成功') ? '#d4edda' : '#f8d7da',
              color: msg.includes('成功') ? '#155724' : '#721c24',
              border: `1px solid ${msg.includes('成功') ? '#c3e6cb' : '#f5c6cb'}`,
              textAlign: 'center',
              fontSize: 14
            }}>
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 