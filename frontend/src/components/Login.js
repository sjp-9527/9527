import React, { useState } from 'react';
import API from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { username, password });
      setMsg('登录成功');
      onLogin && onLogin(res.data.token, username);
    } catch (err) {
      setMsg(err.response?.data?.error || '登录失败');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>登录</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="用户名" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码" required />
      <button type="submit">登录</button>
      <div>{msg}</div>
    </form>
  );
} 