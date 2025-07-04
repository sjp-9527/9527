# API密钥配置指南

## 1. 获取API密钥

### Unsplash API密钥
1. 访问 [Unsplash开发者页面](https://unsplash.com/developers)
2. 注册/登录账号
3. 创建新应用：
   - Application name: `Travel Community App`
   - Description: `旅游社区应用，用于展示景区图片`
   - What are you building?: `Web应用`
4. 复制 `Access Key`

### Pixabay API密钥
1. 访问 [Pixabay API页面](https://pixabay.com/api/docs/)
2. 点击 "Get API Key"
3. 注册/登录账号
4. 复制API密钥

### 抖音API密钥（可选）
1. 访问 [抖音开放平台](https://open.douyin.com/)
2. 注册/登录开发者账号
3. 创建应用：
   - 应用名称: `Travel Community App`
   - 应用描述: `旅游社区应用，用于展示景区图片`
   - 应用类型: `Web应用`
4. 获取API密钥：
   - Client Key
   - Client Secret
   - Access Token

**注意**: 抖音API需要企业认证，审核较严格。如果无法获取官方API密钥，可以使用模拟数据。

### 高德地图API密钥
1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册/登录账号
3. 创建应用：
   - 应用名称: `Travel Community App`
   - 应用描述: `旅游社区应用，用于地点搜索`
   - 应用类型: `Web服务`
4. 获取API密钥：
   - 复制 `Key` 字段

**注意**: 高德地图API提供免费额度，每日30万次请求。

## 2. 配置环境变量

### 方法1：创建.env文件（推荐）

在 `backend/` 目录下创建 `.env` 文件：

```bash
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_PATH=./database.sqlite

# JWT配置
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# 图片API密钥
UNSPLASH_API_KEY=your_unsplash_api_key_here
PIXABAY_API_KEY=your_pixabay_api_key_here

# 抖音API密钥（可选）
DOUYIN_API_KEY=your_douyin_api_key_here
DOUYIN_CLIENT_KEY=your_douyin_client_key_here
DOUYIN_CLIENT_SECRET=your_douyin_client_secret_here
AMAP_API_KEY=your_amap_api_key_here

# 高德地图API密钥
AMAP_API_KEY=your_amap_api_key_here

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# 限流配置
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=5
```

### 方法2：直接在代码中配置

修改 `backend/controllers/imageController.js` 文件：

```javascript
// 将这两行：
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY || 'YOUR_UNSPLASH_API_KEY';
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || 'YOUR_PIXABAY_API_KEY';

// 替换为你的实际API密钥：
const UNSPLASH_API_KEY = 'your_actual_unsplash_api_key';
const PIXABAY_API_KEY = 'your_actual_pixabay_api_key';
```

## 3. 安装环境变量支持

如果使用方法1，需要安装dotenv：

```bash
cd backend
npm install dotenv
```

然后在 `backend/app.js` 文件顶部添加：

```javascript
import dotenv from 'dotenv';
dotenv.config();
```

## 4. 测试API密钥

配置完成后，可以通过以下方式测试：

### 测试Unsplash API
```bash
curl "http://localhost:3000/api/images/unsplash?query=长城"
```

### 测试Pixabay API
```bash
curl "http://localhost:3000/api/images/pixabay?query=西湖"
```

### 测试抖音API
```bash
curl "http://localhost:3000/api/douyin/hot?category=travel"
curl "http://localhost:3000/api/douyin/search?query=长城"
```

### 测试高德地图API
```bash
curl "http://localhost:3000/api/map/search?keyword=长城"
curl "http://localhost:3000/api/map/hot-cities"
curl "http://localhost:3000/api/map/geocode?address=北京天安门"
```

## 5. 安全注意事项

- ⚠️ **不要将API密钥提交到Git仓库**
- ✅ 将 `.env` 文件添加到 `.gitignore`
- ✅ 在生产环境中使用环境变量
- ✅ 定期轮换API密钥

## 6. 使用限制

### Unsplash API限制
- 每小时最多50次请求（免费版）
- 需要标注摄影师信息

### Pixabay API限制
- 每小时最多5000次请求（免费版）
- 需要标注图片来源

### 抖音API限制
- 需要企业认证
- 每日请求限制根据认证等级
- 需要遵守抖音内容规范

### 高德地图API限制
- 每日30万次免费请求
- 需要遵守高德地图使用条款
- 支持多种地图服务功能

## 7. 故障排除

如果遇到API错误：

1. 检查API密钥是否正确
2. 确认网络连接正常
3. 检查API使用限制
4. 查看后端控制台错误信息

## 8. 示例配置

```bash
# 示例.env文件内容
UNSPLASH_API_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
PIXABAY_API_KEY=12345678-abcdef1234567890abcdef12
DOUYIN_API_KEY=your_douyin_api_key_here
DOUYIN_CLIENT_KEY=your_douyin_client_key_here
DOUYIN_CLIENT_SECRET=your_douyin_client_secret_here
``` 