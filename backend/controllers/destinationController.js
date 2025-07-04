import { Destination } from '../models/index.js';

// 示例风景数据，可替换为数据库查询
const sceneryData = {
  1: [
    { id: 1, name: '扬州瘦西湖', description: '清晨薄雾中的二十四桥，琼花沾露', image: '/uploads/shouxihu.svg' },
    { id: 2, name: '苏州园林', description: '花窗取景框中的海棠与山茶', image: '/uploads/suzhougarden.svg' }
  ],
  2: [
    { id: 3, name: '阿尔山天池', description: '火山地貌与杜鹃湖美景', image: '/uploads/arxan.svg' },
    { id: 4, name: '郑州溱洧水城', description: '古韵灯光下的瓮城夜景', image: '/uploads/zhengzhou.svg' }
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