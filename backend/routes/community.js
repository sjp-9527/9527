import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import {
  createPost, getPosts,
  createComment, getComments,
  toggleLike, getLikes, deletePost, deleteComment, getUserComments, getUserLikes, reportContent, getReports, getAllComments
} from '../controllers/communityController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 压缩图片中间件
const compressImage = async (req, res, next) => {
  if (!req.file) return next();
  const inputPath = req.file.path;
  const outputPath = inputPath + '_compressed.jpg';
  await sharp(inputPath).resize(1200).jpeg({ quality: 80 }).toFile(outputPath);
  req.file.path = outputPath;
  req.file.filename = req.file.filename + '_compressed.jpg';
  next();
};

// 帖子
router.post('/post', upload.single('image'), compressImage, createPost);
router.get('/posts', getPosts);
router.delete('/post/:postId', deletePost);

// 评论
router.post('/comment', createComment);
router.get('/comments/:postId', getComments);
router.delete('/comment/:commentId', deleteComment);
router.get('/all-comments', getAllComments);

// 点赞
router.post('/like', toggleLike);
router.get('/likes/:postId', getLikes);
router.get('/user-comments/:username', getUserComments);
router.get('/user-likes/:username', getUserLikes);

router.post('/report', reportContent);
router.get('/reports', getReports);

export default router; 