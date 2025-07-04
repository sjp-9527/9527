import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = 'your_jwt_secret'; // 实际项目请用环境变量

// 注册
export async function register(req, res) {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });
    res.json({ message: '注册成功', user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(400).json({ error: '用户名已存在' });
  }
}

// 登录
export async function login(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(400).json({ error: '用户不存在' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: '密码错误' });
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1d' });
  res.json({ message: '登录成功', token });
}

export async function getUserInfo(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: '缺少用户名' });
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json({ username: user.username, isAdmin: user.isAdmin });
} 