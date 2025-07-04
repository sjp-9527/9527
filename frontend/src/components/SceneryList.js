import React, { useEffect, useState, useRef } from 'react';
import API from '../api';
import { ThemeContext } from '../ThemeContext';

export default function SceneryList({ destinationId }) {
  const [scenery, setScenery] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const { theme } = React.useContext(ThemeContext);

  // 获取风景数据
  useEffect(() => {
    if (destinationId) {
      setLoading(true);
      setError(null);
      API.get(`/destinations/${destinationId}/scenery`)
        .then(res => {
          setScenery(res.data);
          setCurrent(0); // 切换目的地时重置索引
        })
        .catch(err => {
          setError('获取风景数据失败，请稍后重试');
          console.error('获取风景数据失败:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setScenery([]);
      setCurrent(0);
      setError(null);
    }
  }, [destinationId]);

  // 自动切换
  useEffect(() => {
    if (scenery.length === 0) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % scenery.length);
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, [scenery, current]);

  // 手动切换时重置自动切换计时
  const handlePrev = () => {
    setCurrent(prev => (prev - 1 + scenery.length) % scenery.length);
  };
  const handleNext = () => {
    setCurrent(prev => (prev + 1) % scenery.length);
  };

  if (!destinationId) return null;

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        color: theme === 'dark' ? '#eee' : '#222'
      }}>
        <div>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        color: theme === 'dark' ? '#eee' : '#222'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{error}</div>
          <button onClick={() => window.location.reload()}>重试</button>
        </div>
      </div>
    );
  }

  if (scenery.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        color: theme === 'dark' ? '#eee' : '#222'
      }}>
        <div>暂无风景数据</div>
      </div>
    );
  }

  const currentScenery = scenery[current] || {};

  return (
    <div style={{ position: 'relative', width: '100vw', height: '60vh', overflow: 'hidden', color: theme==='dark'?'#eee':'#222', transition:'color 0.4s' }}>
      {/* 背景图片 */}
      {currentScenery.image && (
        <div
          style={{
            backgroundImage: `url(http://localhost:3000${currentScenery.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px) brightness(0.7)',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            transition: 'background-image 0.5s',
          }}
        />
      )}
      {/* 信息和按钮 */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        color: theme==='dark'?'#eee':'#fff',
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        <h2 style={{ background: 'rgba(0,0,0,0.4)', padding: '8px 24px', borderRadius: 8 }}>{currentScenery.name}</h2>
        <p style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 24px', borderRadius: 8 }}>{currentScenery.description}</p>
        {currentScenery.image && <img src={`http://localhost:3000${currentScenery.image}`} alt={currentScenery.name} style={{ maxWidth: 120, borderRadius: 8, marginTop: 12 }} loading="lazy" />}
        <div style={{ marginTop: 24 }}>
          <button onClick={handlePrev} style={{ marginRight: 16 }}>上一张</button>
          <button onClick={handleNext}>下一张</button>
        </div>
        {/* 指示器 */}
        {scenery.length > 1 && (
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            {scenery.map((_, index) => (
              <div
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: index === current ? '#fff' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrent(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 