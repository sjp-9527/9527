import { Post, Comment, Like } from '../models/index.js';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { User } from '../models/index.js';

// 敏感词列表
const SENSITIVE_WORDS = ['傻逼', '垃圾', '违法', '暴力', '恐怖', 'fuck', 'shit'];
function containsSensitive(text) {
  if (!text) return false;
  return SENSITIVE_WORDS.some(word => text.includes(word));
}

// 举报数据（内存，生产建议存数据库）
let reports = [];

// 工具函数：校验管理员
async function checkAdmin(req, res) {
  const username = req.query.admin || req.body.admin || req.params.admin;
  if (!username) return false;
  const user = await User.findOne({ where: { username } });
  return user && user.isAdmin;
}

// 发布帖子（支持图片上传）
export async function createPost(req, res) {
  try {
    let imagePath = '';
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }
    const { text, username } = req.body;
    if (containsSensitive(text)) {
      return res.status(400).json({ error: '内容包含敏感词，禁止发布' });
    }
    const post = await Post.create({ text, image: imagePath, username });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: '发布失败' });
  }
}

// 获取所有帖子，按时间倒序
export async function getPosts(req, res) {
  const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
  res.json(posts);
}

// 发布评论
export async function createComment(req, res) {
  try {
    const { postId, text, username } = req.body;
    if (containsSensitive(text)) {
      return res.status(400).json({ error: '评论包含敏感词，禁止发布' });
    }
    const comment = await Comment.create({ postId, text, username });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: '评论失败' });
  }
}

// 获取某帖所有评论
export async function getComments(req, res) {
  const { postId } = req.params;
  const comments = await Comment.findAll({ where: { postId }, order: [['createdAt', 'ASC']] });
  res.json(comments);
}

// 点赞/取消点赞
export async function toggleLike(req, res) {
  const { postId, username } = req.body;
  const like = await Like.findOne({ where: { postId, username } });
  if (like) {
    await like.destroy();
    res.json({ liked: false });
  } else {
    await Like.create({ postId, username });
    res.json({ liked: true });
  }
}

// 获取某帖点赞数
export async function getLikes(req, res) {
  const { postId } = req.params;
  const count = await Like.count({ where: { postId } });
  res.json({ count });
}

// 删除帖子（仅作者可删）
export async function deletePost(req, res) {
  const { postId } = req.params;
  const { username } = req.body;
  const post = await Post.findByPk(postId);
  if (!post) return res.status(404).json({ error: '帖子不存在' });
  // 判断是否管理员
  const user = await User.findOne({ where: { username } });
  if (post.username !== username && !(user && user.isAdmin)) return res.status(403).json({ error: '无权删除' });
  await Comment.destroy({ where: { postId } });
  await Like.destroy({ where: { postId } });
  await post.destroy();
  res.json({ success: true });
}

// 删除评论（仅作者可删）
export async function deleteComment(req, res) {
  const { commentId } = req.params;
  const { username } = req.body;
  const comment = await Comment.findByPk(commentId);
  if (!comment) return res.status(404).json({ error: '评论不存在' });
  if (comment.username !== username) return res.status(403).json({ error: '无权删除' });
  await comment.destroy();
  res.json({ success: true });
}

// 获取指定用户的所有评论
export async function getUserComments(req, res) {
  const { username } = req.params;
  const comments = await Comment.findAll({ where: { username }, order: [['createdAt', 'DESC']] });
  res.json(comments);
}
// 获取指定用户的所有点赞
export async function getUserLikes(req, res) {
  const { username } = req.params;
  const likes = await Like.findAll({ where: { username }, order: [['id', 'DESC']] });
  res.json(likes);
}

// 举报接口
export async function reportContent(req, res) {
  const { type, targetId, reason, username } = req.body; // type: post/comment
  reports.push({ type, targetId, reason, username, time: Date.now() });
  res.json({ success: true });
}

// 管理员获取所有举报
export async function getReports(req, res) {
  if (!(await checkAdmin(req, res))) return res.status(403).json({ error: '无管理员权限' });
  res.json(reports);
}

// 获取所有评论（管理员用）
export async function getAllComments(req, res) {
  if (!(await checkAdmin(req, res))) return res.status(403).json({ error: '无管理员权限' });
  const comments = await Comment.findAll({ order: [['createdAt', 'DESC']] });
  res.json(comments);
} 