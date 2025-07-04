import express from 'express';
import { getDestinations, addDestination, getSceneryByDestination } from '../controllers/destinationController.js';

const router = express.Router();

router.get('/', getDestinations);
router.post('/', addDestination);
// 新增：根据目的地ID获取风景推荐
router.get('/:id/scenery', getSceneryByDestination);

export default router; 