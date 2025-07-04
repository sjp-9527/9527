# 旅游社区应用

一个基于React和Node.js的旅游社区应用，支持目的地选择、风景展示、社区交流等功能。

## 功能特性

- 🌍 **目的地选择**: 支持多个旅游目的地的选择
- 🖼️ **风景展示**: 自动轮播展示各目的地的风景图片
- 👥 **社区交流**: 用户可以发布帖子、评论、点赞
- 🌙 **主题切换**: 支持明暗主题切换
- 📱 **响应式设计**: 适配不同屏幕尺寸
- 🔒 **用户认证**: 支持用户注册、登录功能
- 🛡️ **内容管理**: 管理员可以管理用户举报内容

## 技术栈

### 前端
- React.js
- Axios (API请求)
- CSS-in-JS (样式)

### 后端
- Node.js
- Express.js
- SQLite (数据库)
- Multer (文件上传)
- Express-rate-limit (限流)

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/sjp-9527/9527.git
cd 9527
```

### 2. 安装依赖

#### 后端依赖
```bash
cd backend
npm install
```

#### 前端依赖
```bash
cd frontend
npm install
```

### 3. 启动服务

#### 启动后端服务
```bash
cd backend
npm start
# 或者
node app.js
```
后端服务将在 http://localhost:3000 启动

#### 启动前端服务
```bash
cd frontend
npm start
```
前端服务将在 http://localhost:3000 启动

### 4. 访问应用
打开浏览器访问 http://localhost:3000

## 项目结构

```
├── backend/                 # 后端代码
│   ├── controllers/        # 控制器
│   ├── models/            # 数据模型
│   ├── routes/            # 路由
│   ├── uploads/           # 上传文件
│   └── app.js            # 主入口文件
├── frontend/              # 前端代码
│   ├── public/           # 静态文件
│   ├── src/              # 源代码
│   │   ├── components/   # React组件
│   │   ├── api.js        # API配置
│   │   └── App.js        # 主应用组件
│   └── package.json
└── README.md
```

## API接口

### 目的地相关
- `GET /api/destinations` - 获取所有目的地
- `GET /api/destinations/:id/scenery` - 获取指定目的地的风景

### 社区相关
- `GET /api/community/posts` - 获取帖子列表
- `POST /api/community/post` - 发布帖子
- `POST /api/community/comment` - 发表评论
- `POST /api/community/like` - 点赞/取消点赞

### 用户认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

## 开发说明

### 添加新的目的地
1. 在 `backend/controllers/destinationController.js` 中的 `sceneryData` 对象添加新数据
2. 在 `backend/uploads/` 目录添加对应的图片文件
3. 重启后端服务

### 自定义主题
在 `frontend/src/ThemeContext.js` 中修改主题配置

## 部署

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 生产环境部署
1. 构建前端
```bash
cd frontend
npm run build
```

2. 配置环境变量
3. 启动后端服务

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License 