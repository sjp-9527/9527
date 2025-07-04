import { Destination } from '../models/index.js';

// 示例风景数据，可替换为数据库查询
const sceneryData = {
  1: [
    { id: 1, name: '长城', description: '中国著名古迹', image: '/uploads/greatwall.jpg' },
    { id: 2, name: '颐和园', description: '皇家园林', image: '/uploads/summerpalace.jpg' }
  ],
  2: [
    { id: 3, name: '外滩', description: '上海地标', image: '/uploads/bund.jpg' },
    { id: 4, name: '东方明珠', description: '著名电视塔', image: '/uploads/orientaltower.jpg' }
  ]
};

export async function getDestinations(req, res) {
  const destinations = await Destination.findAll();
  res.json(destinations);
}

export async function addDestination(req, res) {
  const { name, description } = req.body;
  try {
    const dest = await Destination.create({ name, description });
    res.json(dest);
  } catch (err) {
    res.status(400).json({ error: '添加失败' });
  }
}

// 新增：根据目的地ID获取风景推荐
export async function getSceneryByDestination(req, res) {
  const { id } = req.params;
  const scenery = sceneryData[id] || [];
  res.json(scenery);
} 