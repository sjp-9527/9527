import React, { useEffect, useState } from 'react';
import API from '../api';

export default function DestinationList({ selected, setSelected }) {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    API.get('/destinations').then(res => setDestinations(res.data));
  }, []);

  return (
    <div>
      <h3>选择目的地</h3>
      <select value={selected} onChange={e => setSelected(e.target.value)}>
        <option value="">请选择</option>
        {destinations.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
    </div>
  );
} 