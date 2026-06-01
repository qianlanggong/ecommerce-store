# E-Commerce Store

一个基于 React + TypeScript + Shopify 无头 CMS 的电商独立站 MVP 项目。

## 技术栈

### 核心框架

- **React 18** - 用户界面库
- **TypeScript 5** - 类型安全
- **Vite 6** - 构建工具和开发服务器
- **React Router v7** - 路由管理

### 样式

- **Tailwind CSS 4** - 原子化 CSS 框架
- **Lucide React** - 图标库
- **clsx + tailwind-merge** - 类名合并工具

### 状态管理

- **Zustand** - 轻量级状态管理
- **TanStack Query v5** - 服务端状态管理和数据缓存

### 多语言

- **i18next** - 国际化框架
- **react-i18next** - React 绑定
- **子路径多语言** - /en/、/zh/，SEO 友好

### 电商后端

- **Shopify Storefront API** - 无头电商 CMS
- **@shopify/storefront-api-client** - Shopify 官方客户端
- **API 适配层** - 封装接口，便于未来替换后端

### 开发工具

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Husky** - Git Hooks
- **lint-staged** - 暂存文件检查

### 部署

- **Netlify** - 部署平台
- **SPA 路由回退** - 支持客户端路由

## 项目结构

```
ecommerce-store/
├── public/
│   └── locales/          # 多语言翻译文件
│       ├── en/
│       └── zh/
├── src/
│   ├── assets/           # 静态资源
│   ├── components/       # 通用组件
│   ├── hooks/            # 自定义 Hooks
│   ├── lib/              # 工具库
│   │   ├── i18n/         # 多语言配置
│   │   ├── shopify/      # Shopify 配置
│   │   ├── constants.ts  # 常量定义
│   │   └── utils.ts      # 工具函数
│   ├── pages/            # 页面组件
│   ├── services/         # 服务层
│   │   ├── adapters/     # API 适配器
│   │   │   ├── interface.ts
│   │   │   └── shopify/
│   │   ├── api/          # API 客户端
│   │   ├── productService.ts
│   │   ├── cartService.ts
│   │   └── userService.ts
│   ├── stores/           # Zustand 状态管理
│   ├── types/            # TypeScript 类型定义
│   ├── App.tsx           # 根组件
│   ├── main.tsx          # 入口文件
│   └── index.css         # 全局样式
├── .husky/               # Git Hooks
├── netlify.toml          # Netlify 部署配置
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 环境配置

复制 `.env.example` 为 `.env.local` 并填写配置：

```bash
cp .env.example .env.local
```

配置项：

- `VITE_SHOPIFY_STORE_DOMAIN` - Shopify 店铺域名
- `VITE_SHOPIFY_STOREFRONT_API_TOKEN` - Storefront API 令牌
- `VITE_SHOPIFY_API_VERSION` - API 版本

### 开发

```bash
npm run dev
```

访问 http://localhost:5173

### 构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
npm run check  # TypeScript 类型检查
npm run format # Prettier 格式化
```

## 多语言

项目采用子路径方式实现多语言：

- `/en/` - 英文
- `/zh/` - 中文

翻译文件位于 `public/locales/` 目录下。

## 部署

### Netlify

1. 将代码推送到 Git 仓库
2. 在 Netlify 中关联仓库
3. 配置环境变量
4. 自动部署

`netlify.toml` 已配置：

- 构建命令和输出目录
- 多语言重定向规则
- SPA 路由回退
- 安全头和缓存策略

## 核心功能

### 已完成（Phase 0 - 项目初始化）

- ✅ 项目结构搭建
- ✅ 技术栈配置
- ✅ 多语言框架
- ✅ API 适配层接口
- ✅ Shopify 适配器
- ✅ 业务服务层框架
- ✅ Netlify 部署配置
- ✅ Git Hooks 配置

### 规划中

- 📋 商品列表和详情页
- 📋 购物车功能
- 📋 用户系统（注册、登录）
- 📋 结算流程
- 📋 订单管理
- 📋 Stripe + PayPal 支付集成

## 开发规范

### Git 提交

- 代码提交前自动运行 ESLint 和 Prettier
- 遵循 Conventional Commits 规范

### 代码风格

- 使用 TypeScript 编写类型安全的代码
- 组件采用函数式组件和 Hooks
- 遵循 Tailwind CSS 最佳实践

## 许可证

MIT
