import express from 'express';
import {
    searchPlaces,
    getPlaceDetail,
    getNearbyPlaces,
    geocode,
    reverseGeocode,
    getHotCities,
    getCityList
} from '../controllers/mapController.js';

const router = express.Router();

// 搜索地点
router.get('/search', searchPlaces);

// 获取地点详情
router.get('/place/:id', getPlaceDetail);

// 获取周边地点
router.get('/nearby', getNearbyPlaces);

// 地理编码（地址转坐标）
router.get('/geocode', geocode);

// 逆地理编码（坐标转地址）
router.get('/reverse-geocode', reverseGeocode);

// 获取热门城市
router.get('/hot-cities', getHotCities);

// 获取城市列表
router.get('/cities', getCityList);

export default router; 