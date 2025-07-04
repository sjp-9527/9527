import React, { useState } from 'react';
import API from '../api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { username, password });
      setMsg('注册成功，请登录');
    } catch (err) {
      setMsg(err.response?.data?.error || '注册失败');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>注册</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="用户名" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码" required />
      <button type="submit">注册</button>
      <div>{msg}</div>
    </form>
  );
} 