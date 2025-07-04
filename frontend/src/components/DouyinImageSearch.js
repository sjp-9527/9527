import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import './ImageSearch.css';

const DouyinImageSearch = ({ onImageSelect, onClose }) => {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('hot'); // hot, search, topic, user

    // 获取抖音热门图片
    const fetchHotImages = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/douyin/hot?category=travel&limit=20');
            const data = await response.json();
            if (data.success) {
                setImages(data.data);
            } else {
                setError('获取热门图片失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
            console.error('获取抖音热门图片错误:', err);
        } finally {
            setLoading(false);
        }
    };

    // 搜索抖音图片
    const searchImages = async () => {
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

    // 获取话题图片
    const fetchTopicImages = async (topic) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/douyin/topic?topic=${encodeURIComponent(topic)}&limit=20`);
            const data = await response.json();
            if (data.success) {
                setImages(data.data);
            } else {
                setError('获取话题图片失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
            console.error('获取抖音话题图片错误:', err);
        } finally {
            setLoading(false);
        }
    };

    // 获取用户图片
    const fetchUserImages = async (userId) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/douyin/user?user_id=${encodeURIComponent(userId)}&limit=20`);
            const data = await response.json();
            if (data.success) {
                setImages(data.data);
            } else {
                setError('获取用户图片失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
            console.error('获取用户抖音图片错误:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'hot') {
            fetchHotImages();
        }
    }, [activeTab]);

    const handleImageSelect = (image) => {
        onImageSelect({
            ...image,
            source: 'douyin'
        });
        onClose();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (activeTab === 'search') {
            searchImages();
        }
    };

    const handleTopicClick = (topic) => {
        setActiveTab('topic');
        fetchTopicImages(topic);
    };

    const handleUserSearch = (e) => {
        e.preventDefault();
        const userId = e.target.userId.value;
        if (userId) {
            setActiveTab('user');
            fetchUserImages(userId);
        }
    };

    const popularTopics = ['旅行', '风景', '美食', '文化', '建筑', '自然'];

    return (
        <div className={`image-search-modal ${theme}`}>
            <div className="image-search-content">
                <div className="image-search-header">
                    <h2>抖音图片搜索</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {/* 标签页 */}
                <div className="search-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'hot' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hot')}
                    >
                        热门图片
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        搜索图片
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'topic' ? 'active' : ''}`}
                        onClick={() => setActiveTab('topic')}
                    >
                        话题图片
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
                        onClick={() => setActiveTab('user')}
                    >
                        用户图片
                    </button>
                </div>

                {/* 搜索表单 */}
                {activeTab === 'search' && (
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="输入搜索关键词..."
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

                {/* 用户搜索 */}
                {activeTab === 'user' && (
                    <form onSubmit={handleUserSearch} className="search-form">
                        <input
                            type="text"
                            name="userId"
                            placeholder="输入抖音用户ID..."
                            className="search-input"
                        />
                        <button type="submit" className="search-btn" disabled={loading}>
                            {loading ? '搜索中...' : '搜索'}
                        </button>
                    </form>
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
                                <img src={image.image_url} alt={image.title} />
                                <div className="image-info">
                                    <h4>{image.title}</h4>
                                    <p>作者: {image.author}</p>
                                    <div className="image-stats">
                                        <span>❤️ {image.likes}</span>
                                        <span>💬 {image.comments}</span>
                                    </div>
                                    <div className="image-tags">
                                        {image.tags?.slice(0, 3).map(tag => (
                                            <span key={tag} className="tag">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            {activeTab === 'hot' && '暂无热门图片'}
                            {activeTab === 'search' && '请输入关键词搜索'}
                            {activeTab === 'topic' && '请选择话题'}
                            {activeTab === 'user' && '请输入用户ID'}
                        </div>
                    )}
                </div>

                {/* 来源信息 */}
                <div className="source-info">
                    <p>图片来源: 抖音</p>
                    <p>注意: 使用图片时请遵守相关版权规定</p>
                </div>
            </div>
        </div>
    );
};

export default DouyinImageSearch; 