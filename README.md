# Rclone GUI Frontend

## 项目说明
Rclone的Web图形界面前端项目。

## 开发环境设置

### 本地开发
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

### Docker部署

#### 使用docker-compose（推荐）
```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 使用Docker直接部署
```bash
# 构建镜像
docker build -t rclone-sync-hub-frontend .

# 运行容器
docker run -d \
  -p 8080:80 \
  -e API_URL=http://your-api-server:5001 \
  --name rclone-gui \
  rclone-gui-frontend
```

### 环境变量
- `API_URL`: API服务器地址，默认为 `http://localhost:5001`

### 访问应用
启动后访问 `http://localhost:8080`

## 技术栈
- Vue 3
- Element Plus
- Vite
