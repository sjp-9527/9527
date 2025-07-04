import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import './MapSearch.css';

const MapSearch = ({ onPlaceSelect, onClose }) => {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('search');
    const [hotCities, setHotCities] = useState([]);
    const [cityList, setCityList] = useState({});
    const [showCitySelector, setShowCitySelector] = useState(false);

    useEffect(() => {
        fetchHotCities();
    }, []);

    const fetchHotCities = async () => {
        try {
            const response = await fetch('/api/map/hot-cities');
            const data = await response.json();
            if (data.success) {
                setHotCities(data.data);
            }
        } catch (err) {
            console.error('获取热门城市错误:', err);
        }
    };

    const fetchCityList = async () => {
        try {
            const response = await fetch('/api/map/cities');
            const data = await response.json();
            if (data.success) {
                setCityList(data.data);
            }
        } catch (err) {
            console.error('获取城市列表错误:', err);
        }
    };

    const searchPlaces = async () => {
        if (!searchQuery.trim()) {
            setError('请输入搜索关键词');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams({
                keyword: searchQuery,
                city: selectedCity,
                page: 1,
                pageSize: 20
            });

            const response = await fetch(`/api/map/search?${params}`);
            const data = await response.json();
            if (data.success) {
                setPlaces(data.data);
            } else {
                setError('搜索失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
            console.error('搜索地点错误:', err);
        } finally {
            setLoading(false);
        }
    };

    const getNearbyPlaces = async (location) => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams({
                location: location,
                radius: 3000,
                page: 1,
                pageSize: 20
            });

            const response = await fetch(`/api/map/nearby?${params}`);
            const data = await response.json();
            if (data.success) {
                setPlaces(data.data);
            } else {
                setError('获取周边地点失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
            console.error('获取周边地点错误:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (activeTab === 'search') {
            searchPlaces();
        }
    };

    const handlePlaceSelect = (place) => {
        onPlaceSelect({
            ...place,
            source: 'map'
        });
        onClose();
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city.name);
        setShowCitySelector(false);
    };

    const handleHotCityClick = (city) => {
        setSelectedCity(city.name);
        setActiveTab('search');
    };

    const handleNearbySearch = () => {
        const defaultLocation = '116.397428,39.90923';
        getNearbyPlaces(defaultLocation);
    };

    const getPlaceTypeIcon = (type) => {
        if (type.includes('风景名胜')) return '🏛️';
        if (type.includes('餐饮')) return '🍽️';
        if (type.includes('购物')) return '🛍️';
        if (type.includes('住宿')) return '🏨';
        if (type.includes('交通')) return '🚇';
        if (type.includes('娱乐')) return '🎮';
        return '📍';
    };

    const formatDistance = (distance) => {
        if (!distance) return '';
        if (distance < 1000) {
            return `${distance}米`;
        } else {
            return `${(distance / 1000).toFixed(1)}公里`;
        }
    };

    return (
        <div className={`map-search-modal ${theme}`}>
            <div className="map-search-content">
                <div className="map-search-header">
                    <h2>地图搜索</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="search-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        搜索地点
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'hot' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hot')}
                    >
                        热门城市
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'nearby' ? 'active' : ''}`}
                        onClick={() => setActiveTab('nearby')}
                    >
                        周边搜索
                    </button>
                </div>

                {activeTab === 'search' && (
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="city-selector">
                            <button 
                                type="button"
                                className="city-btn"
                                onClick={() => {
                                    fetchCityList();
                                    setShowCitySelector(!showCitySelector);
                                }}
                            >
                                {selectedCity || '选择城市'}
                            </button>
                            {showCitySelector && (
                                <div className="city-dropdown">
                                    {Object.entries(cityList).map(([region, cities]) => (
                                        <div key={region} className="region-group">
                                            <h4>{region}</h4>
                                            <div className="city-grid">
                                                {cities.map(city => (
                                                    <button
                                                        key={city.code}
                                                        className="city-item"
                                                        onClick={() => handleCitySelect(city)}
                                                    >
                                                        {city.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="输入地点名称..."
                            className="search-input"
                        />
                        <button type="submit" className="search-btn" disabled={loading}>
                            {loading ? '搜索中...' : '搜索'}
                        </button>
                    </form>
                )}

                {activeTab === 'hot' && (
                    <div className="hot-cities">
                        <h3>热门城市</h3>
                        <div className="city-grid">
                            {hotCities.map(city => (
                                <button
                                    key={city.code}
                                    className="hot-city-btn"
                                    onClick={() => handleHotCityClick(city)}
                                >
                                    {city.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'nearby' && (
                    <div className="nearby-section">
                        <h3>周边搜索</h3>
                        <p>搜索您当前位置周边的地点</p>
                        <button 
                            className="nearby-btn"
                            onClick={handleNearbySearch}
                            disabled={loading}
                        >
                            {loading ? '搜索中...' : '开始搜索'}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="places-list">
                    {loading ? (
                        <div className="loading">搜索中...</div>
                    ) : places.length > 0 ? (
                        places.map((place) => (
                            <div key={place.id} className="place-item" onClick={() => handlePlaceSelect(place)}>
                                <div className="place-icon">
                                    {getPlaceTypeIcon(place.type)}
                                </div>
                                <div className="place-info">
                                    <h4>{place.name}</h4>
                                    <p className="place-address">{place.address}</p>
                                    <div className="place-details">
                                        <span className="place-type">{place.type}</span>
                                        {place.distance && (
                                            <span className="place-distance">
                                                {formatDistance(place.distance)}
                                            </span>
                                        )}
                                        {place.rating > 0 && (
                                            <span className="place-rating">
                                                ⭐ {place.rating}
                                            </span>
                                        )}
                                    </div>
                                    {place.tel && (
                                        <p className="place-tel">📞 {place.tel}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            {activeTab === 'search' && '请输入关键词搜索'}
                            {activeTab === 'hot' && '请选择热门城市'}
                            {activeTab === 'nearby' && '点击开始搜索周边地点'}
                        </div>
                    )}
                </div>

                <div className="source-info">
                    <p>数据来源: 高德地图</p>
                    <p>注意: 请遵守相关使用条款</p>
                </div>
            </div>
        </div>
    );
};

export default MapSearch; 