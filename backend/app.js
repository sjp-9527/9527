import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import './models/index.js'; // 确保数据库初始化
import authRoutes from './routes/auth.js';
import destinationRoutes from './routes/destination.js';
import communityRoutes from './routes/community.js';
import imageRoutes from './routes/images.js';
import douyinRoutes from './routes/douyin.js';
import mapRoutes from './routes/map.js';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = 3000;

// 允许跨域
app.use(cors());
// 解析json请求体
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/douyin', douyinRoutes);
app.use('/api/map', mapRoutes);

// 限流：每个IP每分钟最多发帖/评论/举报5次
const postLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, message: '操作过于频繁，请稍后再试' });
app.use('/api/community/post', postLimiter);
app.use('/api/community/comment', postLimiter);
app.use('/api/community/report', postLimiter);

// 图片API限流：每个IP每分钟最多请求20次
const imageLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, message: '图片请求过于频繁，请稍后再试' });
app.use('/api/images', imageLimiter);

// 示例路由
app.get('/', (req, res) => {
  res.send('后端服务已启动');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});