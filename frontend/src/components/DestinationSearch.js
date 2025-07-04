import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import MapSearch from './MapSearch';
import './DestinationSearch.css';

const DestinationSearch = ({ onDestinationSelect, onClose }) => {
    const { theme } = useTheme();
    const [showMapSearch, setShowMapSearch] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('search'); // search, map, recent

    // 获取最近的目的地
    useEffect(() => {
        fetchRecentDestinations();
    }, []);

    const fetchRecentDestinations = async () => {
        try {
            const response = await fetch('/api/destinations');
            const data = await response.json();
            if (Array.isArray(data)) {
                setDestinations(data.slice(0, 10)); // 只显示最近10个
            }
        } catch (err) {
            console.error('获取最近目的地错误:', err);
        }
    };

    // 搜索目的地
    const searchDestinations = async () => {
        if (!searchQuery.trim()) {
            setError('请输入搜索关键词');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/destinations/search?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setDestinations(data);
            } else {
                setError('搜索失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
            console.error('搜索目的地错误:', err);
        } finally {
            setLoading(false);
        }
    };

    // 处理搜索
    const handleSearch = (e) => {
        e.preventDefault();
        if (activeTab === 'search') {
            searchDestinations();
        }
    };

    // 处理目的地选择
    const handleDestinationSelect = (destination) => {
        onDestinationSelect(destination);
        onClose();
    };

    // 处理地图地点选择
    const handlePlaceSelect = (place) => {
        setSelectedPlace(place);
        // 将地图地点转换为目的地格式
        const destination = {
            id: place.id,
            name: place.name,
            description: place.address,
            location: place.location,
            type: place.type,
            city: place.cityname,
            province: place.pname,
            district: place.adname,
            tel: place.tel,
            rating: place.rating,
            source: 'map'
        };
        onDestinationSelect(destination);
        onClose();
    };

    // 获取地点类型图标
    const getDestinationIcon = (type) => {
        if (type?.includes('风景名胜')) return '🏛️';
        if (type?.includes('餐饮')) return '🍽️';
        if (type?.includes('购物')) return '🛍️';
        if (type?.includes('住宿')) return '🏨';
        if (type?.includes('交通')) return '🚇';
        if (type?.includes('娱乐')) return '🎮';
        return '📍';
    };

    return (
        <div className={`destination-search-modal ${theme}`}>
            <div className="destination-search-content">
                <div className="destination-search-header">
                    <h2>目的地搜索</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {/* 标签页 */}
                <div className="search-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        搜索目的地
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
                        onClick={() => setActiveTab('map')}
                    >
                        地图搜索
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recent')}
                    >
                        最近目的地
                    </button>
                </div>

                {/* 搜索表单 */}
                {activeTab === 'search' && (
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="输入目的地名称..."
                            className="search-input"
                        />
                        <button type="submit" className="search-btn" disabled={loading}>
                            {loading ? '搜索中...' : '搜索'}
                        </button>
                    </form>
                )}

                {/* 地图搜索 */}
                {activeTab === 'map' && (
                    <div className="map-search-section">
                        <p>使用地图搜索功能查找目的地</p>
                        <button 
                            className="map-search-btn"
                            onClick={() => setShowMapSearch(true)}
                        >
                            🗺️ 打开地图搜索
                        </button>
                    </div>
                )}

                {/* 错误信息 */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* 目的地列表 */}
                <div className="destinations-list">
                    {loading ? (
                        <div className="loading">搜索中...</div>
                    ) : destinations.length > 0 ? (
                        destinations.map((destination) => (
                            <div 
                                key={destination.id} 
                                className="destination-item" 
                                onClick={() => handleDestinationSelect(destination)}
                            >
                                <div className="destination-icon">
                                    {getDestinationIcon(destination.type)}
                                </div>
                                <div className="destination-info">
                                    <h4>{destination.name}</h4>
                                    <p className="destination-description">
                                        {destination.description || destination.address}
                                    </p>
                                    <div className="destination-details">
                                        {destination.city && (
                                            <span className="destination-city">
                                                📍 {destination.city}
                                            </span>
                                        )}
                                        {destination.rating > 0 && (
                                            <span className="destination-rating">
                                                ⭐ {destination.rating}
                                            </span>
                                        )}
                                        {destination.tel && (
                                            <span className="destination-tel">
                                                📞 {destination.tel}
                                            </span>
                                        )}
                                    </div>
                                    {destination.source === 'map' && (
                                        <span className="destination-source">
                                            来自地图
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            {activeTab === 'search' && '请输入关键词搜索'}
                            {activeTab === 'map' && '点击打开地图搜索'}
                            {activeTab === 'recent' && '暂无最近目的地'}
                        </div>
                    )}
                </div>

                {/* 来源信息 */}
                <div className="source-info">
                    <p>支持多种搜索方式：关键词搜索、地图搜索</p>
                    <p>数据来源：高德地图、本地数据库</p>
                </div>
            </div>

            {/* 地图搜索模态框 */}
            {showMapSearch && (
                <MapSearch 
                    onPlaceSelect={handlePlaceSelect}
                    onClose={() => setShowMapSearch(false)}
                />
            )}
        </div>
    );
};

export default DestinationSearch; 