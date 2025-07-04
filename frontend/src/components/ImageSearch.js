import React, { useState } from 'react';
import { ThemeContext } from '../ThemeContext';

export default function ImageSearch({ onImageSelect }) {
  const [keyword, setKeyword] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = React.useContext(ThemeContext);

  // 使用Unsplash API搜索图片
  const searchImages = async () => {
    if (!keyword.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 注意：需要替换为你的API密钥
      const UNSPLASH_API_KEY = 'YOUR_UNSPLASH_API_KEY';
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=20&client_id=${UNSPLASH_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('API请求失败');
      }
      
      const data = await response.json();
      setImages(data.results || []);
    } catch (err) {
      setError('获取图片失败，请稍后重试');
      console.error('搜索图片失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image) => {
    onImageSelect && onImageSelect(image.urls.regular, image.alt_description);
  };

  return (
    <div style={{
      padding: 20,
      background: theme === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)',
      borderRadius: 12,
      margin: 20
    }}>
      <h3 style={{ color: theme === 'dark' ? '#eee' : '#333', marginBottom: 20 }}>
        搜索景区图片
      </h3>
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="输入景区名称，如：长城、西湖、故宫"
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 6,
            border: '1px solid #ddd',
            fontSize: 14,
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            color: theme === 'dark' ? '#eee' : '#333'
          }}
          onKeyPress={(e) => e.key === 'Enter' && searchImages()}
        />
        <button
          onClick={searchImages}
          disabled={loading}
          style={{
            padding: '10px 20px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '搜索中...' : '搜索'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: 10,
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: 6,
          marginBottom: 20
        }}>
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 15,
          maxHeight: 400,
          overflowY: 'auto'
        }}>
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(image)}
              style={{
                cursor: 'pointer',
                borderRadius: 8,
                overflow: 'hidden',
                border: '2px solid transparent',
                transition: 'border-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = '#007bff'}
              onMouseLeave={(e) => e.target.style.borderColor = 'transparent'}
            >
              <img
                src={image.urls.small}
                alt={image.alt_description || '景区图片'}
                style={{
                  width: '100%',
                  height: 150,
                  objectFit: 'cover'
                }}
              />
              <div style={{
                padding: 8,
                fontSize: 12,
                color: theme === 'dark' ? '#ccc' : '#666',
                backgroundColor: theme === 'dark' ? '#222' : '#f8f9fa'
              }}>
                {image.alt_description || '景区图片'}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: 20, color: theme === 'dark' ? '#eee' : '#333' }}>
          搜索中...
        </div>
      )}
    </div>
  );
} 