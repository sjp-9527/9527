import axios from 'axios';

// 高德地图API配置
const AMAP_API_KEY = process.env.AMAP_API_KEY || 'YOUR_AMAP_API_KEY';
const AMAP_BASE_URL = 'https://restapi.amap.com/v3';

/**
 * 搜索地点
 */
export const searchPlaces = async (req, res) => {
    try {
        const { keyword, city, page = 1, pageSize = 20 } = req.query;
        
        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: '搜索关键词不能为空'
            });
        }

        // 构建高德地图API请求URL
        const searchUrl = `${AMAP_BASE_URL}/place/text`;
        const params = {
            key: AMAP_API_KEY,
            keywords: keyword,
            city: city || '',
            page: page,
            offset: pageSize,
            extensions: 'all' // 返回详细信息
        };

        // 调用高德地图API
        const response = await axios.get(searchUrl, { params });
        
        if (response.data.status === '1') {
            const places = response.data.pois.map(poi => ({
                id: poi.id,
                name: poi.name,
                address: poi.address,
                location: poi.location,
                type: poi.type,
                tel: poi.tel,
                distance: poi.distance,
                pname: poi.pname, // 省份
                cityname: poi.cityname, // 城市
                adname: poi.adname, // 区县
                business_area: poi.business_area, // 商圈
                photos: poi.photos || [],
                rating: poi.biz_ext?.rating || 0,
                cost: poi.biz_ext?.cost || '',
                open_time: poi.biz_ext?.open_time || '',
                parking_type: poi.biz_ext?.parking_type || ''
            }));

            res.json({
                success: true,
                data: places,
                total: response.data.count,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
            });
        } else {
            res.status(500).json({
                success: false,
                message: '地图API调用失败',
                error: response.data.info
            });
        }

    } catch (error) {
        console.error('地图搜索错误:', error);
        res.status(500).json({
            success: false,
            message: '搜索失败，请稍后重试',
            error: error.message
        });
    }
};

/**
 * 获取地点详细信息
 */
export const getPlaceDetail = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: '地点ID不能为空'
            });
        }

        // 构建高德地图API请求URL
        const detailUrl = `${AMAP_BASE_URL}/place/detail`;
        const params = {
            key: AMAP_API_KEY,
            id: id,
            extensions: 'all'
        };

        // 调用高德地图API
        const response = await axios.get(detailUrl, { params });
        
        if (response.data.status === '1' && response.data.pois.length > 0) {
            const poi = response.data.pois[0];
            const detail = {
                id: poi.id,
                name: poi.name,
                address: poi.address,
                location: poi.location,
                type: poi.type,
                tel: poi.tel,
                website: poi.website,
                email: poi.email,
                pname: poi.pname,
                cityname: poi.cityname,
                adname: poi.adname,
                business_area: poi.business_area,
                photos: poi.photos || [],
                rating: poi.biz_ext?.rating || 0,
                cost: poi.biz_ext?.cost || '',
                open_time: poi.biz_ext?.open_time || '',
                parking_type: poi.biz_ext?.parking_type || '',
                description: poi.biz_ext?.description || '',
                facilities: poi.biz_ext?.facilities || [],
                services: poi.biz_ext?.services || []
            };

            res.json({
                success: true,
                data: detail
            });
        } else {
            res.status(404).json({
                success: false,
                message: '未找到该地点信息'
            });
        }

    } catch (error) {
        console.error('获取地点详情错误:', error);
        res.status(500).json({
            success: false,
            message: '获取地点详情失败',
            error: error.message
        });
    }
};

/**
 * 获取周边地点
 */
export const getNearbyPlaces = async (req, res) => {
    try {
        const { location, radius = 3000, type = '', page = 1, pageSize = 20 } = req.query;
        
        if (!location) {
            return res.status(400).json({
                success: false,
                message: '位置坐标不能为空'
            });
        }

        // 构建高德地图API请求URL
        const nearbyUrl = `${AMAP_BASE_URL}/place/around`;
        const params = {
            key: AMAP_API_KEY,
            location: location,
            radius: radius,
            type: type,
            page: page,
            offset: pageSize,
            extensions: 'all'
        };

        // 调用高德地图API
        const response = await axios.get(nearbyUrl, { params });
        
        if (response.data.status === '1') {
            const places = response.data.pois.map(poi => ({
                id: poi.id,
                name: poi.name,
                address: poi.address,
                location: poi.location,
                type: poi.type,
                distance: poi.distance,
                tel: poi.tel,
                rating: poi.biz_ext?.rating || 0,
                photos: poi.photos || []
            }));

            res.json({
                success: true,
                data: places,
                total: response.data.count,
                page: parseInt(page),
                pageSize: parseInt(pageSize)
            });
        } else {
            res.status(500).json({
                success: false,
                message: '获取周边地点失败',
                error: response.data.info
            });
        }

    } catch (error) {
        console.error('获取周边地点错误:', error);
        res.status(500).json({
            success: false,
            message: '获取周边地点失败',
            error: error.message
        });
    }
};

/**
 * 地理编码（地址转坐标）
 */
export const geocode = async (req, res) => {
    try {
        const { address, city } = req.query;
        
        if (!address) {
            return res.status(400).json({
                success: false,
                message: '地址不能为空'
            });
        }

        // 构建高德地图API请求URL
        const geocodeUrl = `${AMAP_BASE_URL}/geocode/geo`;
        const params = {
            key: AMAP_API_KEY,
            address: address,
            city: city || ''
        };

        // 调用高德地图API
        const response = await axios.get(geocodeUrl, { params });
        
        if (response.data.status === '1' && response.data.geocodes.length > 0) {
            const geocode = response.data.geocodes[0];
            const result = {
                location: geocode.location,
                formatted_address: geocode.formatted_address,
                country: geocode.country,
                province: geocode.province,
                city: geocode.city,
                district: geocode.district,
                level: geocode.level
            };

            res.json({
                success: true,
                data: result
            });
        } else {
            res.status(404).json({
                success: false,
                message: '未找到该地址的坐标信息'
            });
        }

    } catch (error) {
        console.error('地理编码错误:', error);
        res.status(500).json({
            success: false,
            message: '地理编码失败',
            error: error.message
        });
    }
};

/**
 * 逆地理编码（坐标转地址）
 */
export const reverseGeocode = async (req, res) => {
    try {
        const { location } = req.query;
        
        if (!location) {
            return res.status(400).json({
                success: false,
                message: '坐标不能为空'
            });
        }

        // 构建高德地图API请求URL
        const reverseGeocodeUrl = `${AMAP_BASE_URL}/geocode/regeo`;
        const params = {
            key: AMAP_API_KEY,
            location: location,
            extensions: 'all'
        };

        // 调用高德地图API
        const response = await axios.get(reverseGeocodeUrl, { params });
        
        if (response.data.status === '1') {
            const regeocode = response.data.regeocode;
            const result = {
                formatted_address: regeocode.formatted_address,
                address_component: regeocode.addressComponent,
                pois: regeocode.pois || [],
                roads: regeocode.roads || [],
                roadinters: regeocode.roadinters || []
            };

            res.json({
                success: true,
                data: result
            });
        } else {
            res.status(500).json({
                success: false,
                message: '逆地理编码失败',
                error: response.data.info
            });
        }

    } catch (error) {
        console.error('逆地理编码错误:', error);
        res.status(500).json({
            success: false,
            message: '逆地理编码失败',
            error: error.message
        });
    }
};

/**
 * 获取热门城市
 */
export const getHotCities = async (req, res) => {
    try {
        // 模拟热门城市数据
        const hotCities = [
            { name: '北京', code: '110100', pinyin: 'beijing' },
            { name: '上海', code: '310100', pinyin: 'shanghai' },
            { name: '广州', code: '440100', pinyin: 'guangzhou' },
            { name: '深圳', code: '440300', pinyin: 'shenzhen' },
            { name: '杭州', code: '330100', pinyin: 'hangzhou' },
            { name: '南京', code: '320100', pinyin: 'nanjing' },
            { name: '成都', code: '510100', pinyin: 'chengdu' },
            { name: '武汉', code: '420100', pinyin: 'wuhan' },
            { name: '西安', code: '610100', pinyin: 'xian' },
            { name: '苏州', code: '320500', pinyin: 'suzhou' },
            { name: '天津', code: '120100', pinyin: 'tianjin' },
            { name: '重庆', code: '500100', pinyin: 'chongqing' }
        ];

        res.json({
            success: true,
            data: hotCities
        });

    } catch (error) {
        console.error('获取热门城市错误:', error);
        res.status(500).json({
            success: false,
            message: '获取热门城市失败',
            error: error.message
        });
    }
};

/**
 * 获取城市列表
 */
export const getCityList = async (req, res) => {
    try {
        // 模拟城市列表数据
        const cityList = {
            '华北': [
                { name: '北京', code: '110100' },
                { name: '天津', code: '120100' },
                { name: '石家庄', code: '130100' },
                { name: '太原', code: '140100' },
                { name: '呼和浩特', code: '150100' }
            ],
            '华东': [
                { name: '上海', code: '310100' },
                { name: '南京', code: '320100' },
                { name: '杭州', code: '330100' },
                { name: '合肥', code: '340100' },
                { name: '福州', code: '350100' },
                { name: '南昌', code: '360100' },
                { name: '济南', code: '370100' }
            ],
            '华南': [
                { name: '广州', code: '440100' },
                { name: '深圳', code: '440300' },
                { name: '南宁', code: '450100' },
                { name: '海口', code: '460100' }
            ],
            '华中': [
                { name: '武汉', code: '420100' },
                { name: '长沙', code: '430100' },
                { name: '郑州', code: '410100' }
            ],
            '西南': [
                { name: '重庆', code: '500100' },
                { name: '成都', code: '510100' },
                { name: '贵阳', code: '520100' },
                { name: '昆明', code: '530100' },
                { name: '拉萨', code: '540100' }
            ],
            '西北': [
                { name: '西安', code: '610100' },
                { name: '兰州', code: '620100' },
                { name: '西宁', code: '630100' },
                { name: '银川', code: '640100' },
                { name: '乌鲁木齐', code: '650100' }
            ],
            '东北': [
                { name: '沈阳', code: '210100' },
                { name: '长春', code: '220100' },
                { name: '哈尔滨', code: '230100' }
            ]
        };

        res.json({
            success: true,
            data: cityList
        });

    } catch (error) {
        console.error('获取城市列表错误:', error);
        res.status(500).json({
            success: false,
            message: '获取城市列表失败',
            error: error.message
        });
    }
}; 