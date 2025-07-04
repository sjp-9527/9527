import React, { useEffect, useState } from 'react';
import API from '../api';
import { ThemeContext } from '../ThemeContext';

export default function DestinationList({ selected, setSelected }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = React.useContext(ThemeContext);

  useEffect(() => {
    setLoading(true);
    setError(null);
    API.get('/destinations')
      .then(res => setDestinations(res.data))
      .catch(err => {
        setError('获取目的地列表失败');
        console.error('获取目的地失败:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ color: theme === 'dark' ? '#eee' : '#222' }}>
        <h3>选择目的地</h3>
        <div>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: theme === 'dark' ? '#eee' : '#222' }}>
        <h3>选择目的地</h3>
        <div style={{ color: '#ff6b6b' }}>{error}</div>
        <button onClick={() => window.location.reload()}>重试</button>
      </div>
    );
  }

  return (
    <div style={{ color: theme === 'dark' ? '#eee' : '#222' }}>
      <h3>选择目的地</h3>
      <select 
        value={selected} 
        onChange={e => setSelected(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: 4,
          border: '1px solid #ccc',
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          color: theme === 'dark' ? '#eee' : '#222',
          minWidth: 200
        }}
      >
        <option value="">请选择目的地</option>
        {destinations.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
      {destinations.length === 0 && !loading && (
        <div style={{ marginTop: 8, color: '#666' }}>暂无目的地数据</div>
      )}
    </div>
  );
} 