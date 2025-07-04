import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import './ImageSearch.css';

const ComprehensiveImageSearch = ({ onImageSelect, onClose }) => {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeSource, setActiveSource] = useState('unsplash'); // unsplash, pixabay, douyin
    const [activeTab, setActiveTab] = useState('search'); // search, hot, topic

    // 搜索Unsplash图片
    const searchUnsplashImages = async () => {
        if (!searchQuery.trim()) {
            setError('请输入搜索关键词');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/images/unsplash?query=${encodeURIComponent(searchQuery)}&limit=20`);
            const data = await response.json();
            if (data.success) {
                setImages(data.data);
            } else {
                setError('搜索失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
            console.error('搜索Unsplash图片错误:', err);
        } finally {
            setLoading(false);
        }
    };

    // 搜索Pixabay图片
    const searchPixabayImages = async () => {
        if (!searchQuery.trim()) {
            setError('请输入搜索关键词');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/images/pixabay?query=${encodeURIComponent(searchQuery)}&limit=20`);
            const data = await response.json();
            if (data.success) {
                setImages(data.data);
            } else {
                setError('搜索失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
            console.error('搜索Pixabay图片错误:', err);
        } finally {
            setLoading(false);
        }
    };

    // 搜索抖音图片
    const searchDouyinImages = async () => {
        if (!searchQuery.trim()) {
            setError('请输入搜索关键词');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/douyin/search?query=${encodeURIComponent(searchQuery)}&limit=20`);
            const data = await response.json();
            if (data.success) {
                setImages(data.data);
            } else {
                setError('搜索失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
            console.error('搜索抖音图片错误:', err);
        } finally {
            setLoading(false);
        }
    };

    // 获取热门图片
    const fetchHotImages = async () => {
        setLoading(true);
        setError('');
        try {
            let response;
            if (activeSource === 'douyin') {
                response = await fetch('/api/douyin/hot?category=travel&limit=20');
            } else if (activeSource === 'unsplash') {
                response = await fetch('/api/images/unsplash?query=travel&limit=20');
            } else if (activeSource === 'pixabay') {
                response = await fetch('/api/images/pixabay?query=travel&limit=20');
            }
            
            const data = await response.json();
            if (data.success) {
                setImages(data.data);
            } else {
                setError('获取热门图片失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
            console.error('获取热门图片错误:', err);
        } finally {
            setLoading(false);
        }
    };

    // 获取话题图片
    const fetchTopicImages = async (topic) => {
        setLoading(true);
        setError('');
        try {
            let response;
            if (activeSource === 'douyin') {
                response = await fetch(`/api/douyin/topic?topic=${encodeURIComponent(topic)}&limit=20`);
            } else {
                // Unsplash和Pixabay使用搜索接口
                response = await fetch(`/api/images/${activeSource}?query=${encodeURIComponent(topic)}&limit=20`);
            }
            
            const data = await response.json();
            if (data.success) {
                setImages(data.data);
            } else {
                setError('获取话题图片失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
            console.error('获取话题图片错误:', err);
        } finally {
            setLoading(false);
        }
    };

    // 执行搜索
    const handleSearch = (e) => {
        e.preventDefault();
        if (activeTab === 'search') {
            if (activeSource === 'unsplash') {
                searchUnsplashImages();
            } else if (activeSource === 'pixabay') {
                searchPixabayImages();
            } else if (activeSource === 'douyin') {
                searchDouyinImages();
            }
        }
    };

    // 切换图片来源时重新加载
    useEffect(() => {
        if (activeTab === 'hot') {
            fetchHotImages();
        }
    }, [activeSource, activeTab]);

    const handleImageSelect = (image) => {
        onImageSelect({
            ...image,
            source: activeSource
        });
        onClose();
    };

    const handleTopicClick = (topic) => {
        setActiveTab('topic');
        fetchTopicImages(topic);
    };

    const popularTopics = ['旅行', '风景', '美食', '文化', '建筑', '自然'];

    const getSourceName = (source) => {
        switch (source) {
            case 'unsplash': return 'Unsplash';
            case 'pixabay': return 'Pixabay';
            case 'douyin': return '抖音';
            default: return source;
        }
    };

    return (
        <div className={`image-search-modal ${theme}`}>
            <div className="image-search-content">
                <div className="image-search-header">
                    <h2>综合图片搜索</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {/* 图片来源选择 */}
                <div className="source-selector">
                    <button 
                        className={`source-btn ${activeSource === 'unsplash' ? 'active' : ''}`}
                        onClick={() => setActiveSource('unsplash')}
                    >
                        Unsplash
                    </button>
                    <button 
                        className={`source-btn ${activeSource === 'pixabay' ? 'active' : ''}`}
                        onClick={() => setActiveSource('pixabay')}
                    >
                        Pixabay
                    </button>
                    <button 
                        className={`source-btn ${activeSource === 'douyin' ? 'active' : ''}`}
                        onClick={() => setActiveSource('douyin')}
                    >
                        抖音
                    </button>
                </div>

                {/* 标签页 */}
                <div className="search-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        搜索图片
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'hot' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hot')}
                    >
                        热门图片
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'topic' ? 'active' : ''}`}
                        onClick={() => setActiveTab('topic')}
                    >
                        话题图片
                    </button>
                </div>

                {/* 搜索表单 */}
                {activeTab === 'search' && (
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`在${getSourceName(activeSource)}中搜索图片...`}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn" disabled={loading}>
                            {loading ? '搜索中...' : '搜索'}
                        </button>
                    </form>
                )}

                {/* 话题选择 */}
                {activeTab === 'topic' && (
                    <div className="topic-section">
                        <h3>热门话题</h3>
                        <div className="topic-tags">
                            {popularTopics.map(topic => (
                                <button
                                    key={topic}
                                    className="topic-tag"
                                    onClick={() => handleTopicClick(topic)}
                                >
                                    #{topic}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 错误信息 */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* 图片网格 */}
                <div className="image-grid">
                    {loading ? (
                        <div className="loading">加载中...</div>
                    ) : images.length > 0 ? (
                        images.map((image) => (
                            <div key={image.id} className="image-item" onClick={() => handleImageSelect(image)}>
                                <img src={image.image_url || image.urls?.small} alt={image.title || image.alt_description} />
                                <div className="image-info">
                                    <h4>{image.title || image.alt_description || '图片'}</h4>
                                    <p>作者: {image.author || image.user?.name || '未知'}</p>
                                    {image.likes && (
                                        <div className="image-stats">
                                            <span>❤️ {image.likes}</span>
                                            {image.comments && <span>💬 {image.comments}</span>}
                                        </div>
                                    )}
                                    {image.tags && (
                                        <div className="image-tags">
                                            {image.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="tag">#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            {activeTab === 'search' && '请输入关键词搜索'}
                            {activeTab === 'hot' && '暂无热门图片'}
                            {activeTab === 'topic' && '请选择话题'}
                        </div>
                    )}
                </div>

                {/* 来源信息 */}
                <div className="source-info">
                    <p>图片来源: {getSourceName(activeSource)}</p>
                    <p>注意: 使用图片时请遵守相关版权规定</p>
                </div>
            </div>
        </div>
    );
};

export default ComprehensiveImageSearch; 