import axios from 'axios';

// 抖音API配置
const DOUYIN_API_KEY = process.env.DOUYIN_API_KEY || 'YOUR_DOUYIN_API_KEY';
const DOUYIN_CLIENT_KEY = process.env.DOUYIN_CLIENT_KEY || 'YOUR_DOUYIN_CLIENT_KEY';
const DOUYIN_CLIENT_SECRET = process.env.DOUYIN_CLIENT_SECRET || 'YOUR_DOUYIN_CLIENT_SECRET';

// 第三方抖音API服务（示例）
const DOUYIN_THIRD_PARTY_API = process.env.DOUYIN_THIRD_PARTY_API || 'https://api.douyin.com';

/**
 * 获取抖音热门图片
 */
export const getDouyinHotImages = async (req, res) => {
    try {
        const { category = 'travel', limit = 20 } = req.query;
        
        // 模拟抖音API响应（实际使用时需要替换为真实API）
        const mockImages = [
            {
                id: 'douyin_001',
                title: '美丽的长城风景',
                image_url: 'https://picsum.photos/400/300?random=1',
                author: '抖音用户001',
                likes: 1234,
                comments: 56,
                source: 'douyin',
                tags: ['长城', '风景', '旅游']
            },
            {
                id: 'douyin_002',
                title: '西湖美景如画',
                image_url: 'https://picsum.photos/400/300?random=2',
                author: '抖音用户002',
                likes: 2345,
                comments: 78,
                source: 'douyin',
                tags: ['西湖', '美景', '杭州']
            },
            {
                id: 'douyin_003',
                title: '故宫的黄昏',
                image_url: 'https://picsum.photos/400/300?random=3',
                author: '抖音用户003',
                likes: 3456,
                comments: 90,
                source: 'douyin',
                tags: ['故宫', '黄昏', '北京']
            }
        ];

        // 根据分类过滤图片
        const filteredImages = mockImages.filter(img => 
            img.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
        );

        res.json({
            success: true,
            data: filteredImages.slice(0, parseInt(limit)),
            total: filteredImages.length,
            source: 'douyin'
        });

    } catch (error) {
        console.error('抖音API错误:', error);
        res.status(500).json({
            success: false,
            message: '获取抖音图片失败',
            error: error.message
        });
    }
};

/**
 * 搜索抖音图片
 */
export const searchDouyinImages = async (req, res) => {
    try {
        const { query, limit = 20 } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: '搜索关键词不能为空'
            });
        }

        // 模拟搜索结果
        const searchResults = [
            {
                id: `douyin_search_${Date.now()}_1`,
                title: `${query} - 精彩瞬间`,
                image_url: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
                author: '抖音创作者',
                likes: Math.floor(Math.random() * 5000),
                comments: Math.floor(Math.random() * 200),
                source: 'douyin',
                tags: [query, '热门', '推荐']
            },
            {
                id: `douyin_search_${Date.now()}_2`,
                title: `${query} - 绝美风景`,
                image_url: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
                author: '旅行达人',
                likes: Math.floor(Math.random() * 5000),
                comments: Math.floor(Math.random() * 200),
                source: 'douyin',
                tags: [query, '风景', '摄影']
            }
        ];

        res.json({
            success: true,
            data: searchResults.slice(0, parseInt(limit)),
            query,
            total: searchResults.length,
            source: 'douyin'
        });

    } catch (error) {
        console.error('抖音搜索API错误:', error);
        res.status(500).json({
            success: false,
            message: '搜索抖音图片失败',
            error: error.message
        });
    }
};

/**
 * 获取抖音用户发布的图片
 */
export const getUserDouyinImages = async (req, res) => {
    try {
        const { user_id, limit = 20 } = req.query;
        
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: '用户ID不能为空'
            });
        }

        // 模拟用户图片数据
        const userImages = [
            {
                id: `user_${user_id}_1`,
                title: '我的旅行记录',
                image_url: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
                author: `用户${user_id}`,
                likes: Math.floor(Math.random() * 1000),
                comments: Math.floor(Math.random() * 50),
                source: 'douyin',
                tags: ['旅行', '记录', '生活']
            }
        ];

        res.json({
            success: true,
            data: userImages.slice(0, parseInt(limit)),
            user_id,
            total: userImages.length,
            source: 'douyin'
        });

    } catch (error) {
        console.error('获取用户抖音图片错误:', error);
        res.status(500).json({
            success: false,
            message: '获取用户抖音图片失败',
            error: error.message
        });
    }
};

/**
 * 获取抖音热门话题图片
 */
export const getDouyinTopicImages = async (req, res) => {
    try {
        const { topic, limit = 20 } = req.query;
        
        if (!topic) {
            return res.status(400).json({
                success: false,
                message: '话题不能为空'
            });
        }

        // 模拟话题图片数据
        const topicImages = [
            {
                id: `topic_${topic}_1`,
                title: `#${topic} 精彩内容`,
                image_url: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 100)}`,
                author: '话题参与者',
                likes: Math.floor(Math.random() * 3000),
                comments: Math.floor(Math.random() * 150),
                source: 'douyin',
                tags: [topic, '热门话题', '推荐']
            }
        ];

        res.json({
            success: true,
            data: topicImages.slice(0, parseInt(limit)),
            topic,
            total: topicImages.length,
            source: 'douyin'
        });

    } catch (error) {
        console.error('获取抖音话题图片错误:', error);
        res.status(500).json({
            success: false,
            message: '获取抖音话题图片失败',
            error: error.message
        });
    }
};

/**
 * 获取抖音API访问令牌
 */
export const getDouyinAccessToken = async (req, res) => {
    try {
        // 这里应该调用抖音API获取访问令牌
        // 由于需要真实的API密钥，这里返回模拟数据
        const accessToken = {
            access_token: 'mock_access_token_' + Date.now(),
            expires_in: 7200,
            refresh_token: 'mock_refresh_token_' + Date.now()
        };

        res.json({
            success: true,
            data: accessToken
        });

    } catch (error) {
        console.error('获取抖音访问令牌错误:', error);
        res.status(500).json({
            success: false,
            message: '获取抖音访问令牌失败',
            error: error.message
        });
    }
}; 