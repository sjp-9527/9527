import express from 'express';
import {
    getDouyinHotImages,
    searchDouyinImages,
    getUserDouyinImages,
    getDouyinTopicImages,
    getDouyinAccessToken
} from '../controllers/douyinController.js';

const router = express.Router();

// 获取抖音热门图片
router.get('/hot', getDouyinHotImages);

// 搜索抖音图片
router.get('/search', searchDouyinImages);

// 获取用户抖音图片
router.get('/user', getUserDouyinImages);

// 获取抖音话题图片
router.get('/topic', getDouyinTopicImages);

// 获取抖音访问令牌
router.get('/token', getDouyinAccessToken);

export default router; 