import express from 'express';
import { 
  searchUnsplashImages, 
  searchPixabayImages, 
  getRandomSceneryImage,
  getSceneryImages 
} from '../controllers/imageController.js';

const router = express.Router();

// 搜索Unsplash图片
router.get('/unsplash', searchUnsplashImages);

// 搜索Pixabay图片
router.get('/pixabay', searchPixabayImages);

// 获取随机风景图片
router.get('/random', getRandomSceneryImage);

// 批量获取景区图片
router.post('/scenery', getSceneryImages);

export default router; 