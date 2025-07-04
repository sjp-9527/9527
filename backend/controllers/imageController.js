import fetch from 'node-fetch';

// 配置API密钥（实际使用时应该放在环境变量中）
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY || 'YOUR_UNSPLASH_API_KEY';
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || 'YOUR_PIXABAY_API_KEY';

// 从Unsplash搜索图片
export async function searchUnsplashImages(req, res) {
  const { query, page = 1, per_page = 20 } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: '请提供搜索关键词' });
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}&client_id=${UNSPLASH_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API错误: ${response.status}`);
    }

    const data = await response.json();
    res.json({
      images: data.results || [],
      total: data.total || 0,
      total_pages: data.total_pages || 0
    });
  } catch (error) {
    console.error('Unsplash API错误:', error);
    res.status(500).json({ error: '获取图片失败' });
  }
}

// 从Pixabay搜索图片
export async function searchPixabayImages(req, res) {
  const { query, page = 1, per_page = 20 } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: '请提供搜索关键词' });
  }

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}&image_type=photo&safesearch=true`
    );

    if (!response.ok) {
      throw new Error(`Pixabay API错误: ${response.status}`);
    }

    const data = await response.json();
    res.json({
      images: data.hits || [],
      total: data.totalHits || 0,
      total_pages: Math.ceil((data.totalHits || 0) / per_page)
    });
  } catch (error) {
    console.error('Pixabay API错误:', error);
    res.status(500).json({ error: '获取图片失败' });
  }
}

// 获取随机风景图片
export async function getRandomSceneryImage(req, res) {
  const { category = 'landscape' } = req.query;
  
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${category}&client_id=${UNSPLASH_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API错误: ${response.status}`);
    }

    const image = await response.json();
    res.json({
      image: image.urls.regular,
      alt: image.alt_description,
      photographer: image.user?.name,
      download_url: image.links?.download
    });
  } catch (error) {
    console.error('获取随机图片错误:', error);
    res.status(500).json({ error: '获取图片失败' });
  }
}

// 批量获取景区图片
export async function getSceneryImages(req, res) {
  const { destinations = [] } = req.body;
  
  if (!Array.isArray(destinations) || destinations.length === 0) {
    return res.status(400).json({ error: '请提供目的地列表' });
  }

  try {
    const imagePromises = destinations.map(async (destination) => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&per_page=1&client_id=${UNSPLASH_API_KEY}`
        );
        
        if (response.ok) {
          const data = await response.json();
          return {
            destination,
            image: data.results?.[0]?.urls?.regular || null,
            alt: data.results?.[0]?.alt_description || destination
          };
        }
        return { destination, image: null, alt: destination };
      } catch (error) {
        console.error(`获取${destination}图片失败:`, error);
        return { destination, image: null, alt: destination };
      }
    });

    const results = await Promise.all(imagePromises);
    res.json({ images: results });
  } catch (error) {
    console.error('批量获取图片错误:', error);
    res.status(500).json({ error: '获取图片失败' });
  }
} 