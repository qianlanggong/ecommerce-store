# 电商独立站项目开发计划

---

## 📑 文档元数据

| 字段 | 值 |
|------|-----|
| **文档编号** | DOC-PLAN-2026-001 |
| **文档版本** | v3.0 |
| **项目名称** | 跨境电商独立站 MVP |
| **创建日期** | 2026-05-31 |
| **最后更新** | 2026-06-04 |
| **文档类型** | 项目开发计划 |
| **所属阶段** | Phase 0-5 完成，Phase 6-7 规划中 |
| **编写人** | AI 开发助手 |
| **审核人** | 项目负责人 |
| **机密等级** | 内部公开 |
| **关联文档** | [20260604_project_progress_report_v4.0.md](file:///d:/Atemp/cc/ecommerce-store/.trae/documents/phase_reports/20260604_project_progress_report_v4.0.md), [20260604_phase5_complete_report_v1.0.md](file:///d:/Atemp/cc/ecommerce-store/.trae/documents/phase_reports/20260604_phase5_complete_report_v1.0.md), [api_reference.md](file:///d:/Atemp/cc/ecommerce-store/.trae/documents/api_reference.md), [development_guide.md](file:///d:/Atemp/cc/ecommerce-store/.trae/documents/development_guide.md) |
| **关联 Commit** | `622f78e` (Phase 5), `0439081` (文档更新) |
| **标签** | `项目计划`, `开发文档`, `跨境电商`, `Shopify`, `React`, `TypeScript`, `物流追踪`, `SEO` |

---

## 一、项目概述

### 1.1 项目定位
- **项目名称**：跨境电商独立站（暂定名：Maison Artisan）
- **项目目标**：搭建一个 MVP 版本的跨境电商独立站，支持多语言，快速上线，后续迭代优化
- **核心价值**：
  - 学习 Shopify 无头电商开发，提升技术栈深度
  - 积累完整电商项目经验
  - 建立规范化的项目结构，便于 AI 辅助开发
  - 为未来业务扩展预留架构空间

### 1.2 项目背景
- **开发团队**：单人开发（前端背景）
- **技术基础**：HTML/CSS/JS、jQuery、Vue、React、Node.js 基础
- **时间规划**：MVP 快速上线，持续迭代
- **开发模式**：纯前端 + Shopify 无头 CMS

---

## 二、需求分析

### 2.1 核心功能（MVP 版本）

| 模块 | 功能描述 | 实现方式 | 优先级 | 状态 |
|------|----------|----------|--------|------|
| **商品展示** | 首页、商品列表、商品详情、商品分类 | 前端 + Shopify Storefront API | P0 | ✅ 完成 |
| **用户系统** | 注册、登录、个人中心 | Shopify Customer API | P0 | ✅ 完成 |
| **购物车** | 添加、删除、修改数量、结算 | Shopify Cart API | P0 | ✅ 完成 |
| **收藏管理** | 商品收藏、收藏列表 | 前端 localStorage | P1 | ✅ 完成 |
| **地址管理** | 收货地址增删改查 | Shopify Customer API | P0 | ✅ 完成 |
| **订单管理** | 订单列表、订单详情、订单状态 | Shopify Order API | P0 | ✅ 完成 |
| **支付系统** | 结算、支付、支付回调 | Shopify Checkout API | P0 | ✅ 完成 |
| **多语言系统** | 中英文切换、UI 翻译 | i18next + 子路径路由 | P0 | ✅ 完成 |
| **物流追踪** | 物流信息展示、追踪地图、配送状态推送 | Shopify Fulfillment API + 物流服务商 API | P1 | ⏳ 规划中（Phase 7） |
| **折扣系统** | 折扣码应用、移除 | Shopify Checkout API | P0 | ✅ 完成 |
| **配送方式** | 配送方式选择、运费计算 | Shopify Shipping API | P0 | ✅ 完成 |
| **SEO 优化** | Meta 标签、sitemap、robots.txt、结构化数据、预渲染 | React Helmet + Netlify 预渲染 | P0 | ⏳ 规划中（Phase 6） |

### 2.2 非功能需求

| 需求类型 | 具体要求 | 状态 |
|----------|----------|------|
| **性能** | 首屏加载 < 2s，LCP < 2.5s，页面切换 < 300ms | ✅ 设计中 |
| **SEO** | Meta 标签动态生成、sitemap.xml、robots.txt、结构化数据、OG/Twitter 标签、多语言 hreflang、预渲染关键页面 | ⏳ 规划中（Phase 6） |
| **多语言** | /zh/ 和 /en/ 子路径，URL 友好，SEO 友好 | ✅ 完成 |
| **响应式** | 移动端优先，支持 320px - 1920px+ | ✅ 完成 |
| **可维护性** | 模块化设计，清晰的目录结构，完善的注释规范 | ✅ 完成 |
| **可扩展性** | 低耦合设计，便于后续替换 Shopify 为自建后端 | ✅ 完成 |
| **安全性** | HTTPS，XSS 防护，CSRF 防护，敏感数据加密 | ✅ 完成 |
| **可访问性 (a11y)** | 符合 WCAG 2.1 AA 标准，语义化 HTML，键盘导航，屏幕阅读器支持 | ✅ 设计中 |

---

## 三、技术架构

### 3.1 技术选型

| 层级 | 技术选型 | 选择理由 |
|------|----------|----------|
| **前端框架** | React 18 + TypeScript | 生态成熟，学习资源多，就业市场需求大 |
| **构建工具** | Vite 6 | 开发体验好，热更新快，构建速度快 |
| **样式方案** | Tailwind CSS 4 | 原子化 CSS，开发效率高，便于统一设计系统 |
| **状态管理** | Zustand 5 | 轻量级，API 简洁，适合中小型项目 |
| **路由方案** | React Router v7 | 支持嵌套路由、动态路由，配合子路径多语言 |
| **多语言方案** | i18next + react-i18next | 功能完善，支持插值、复数、日期格式化 |
| **数据请求** | TanStack Query v5 | 缓存、重发、乐观更新，提升用户体验 |
| **电商后端** | Shopify（无头模式） | 成熟的电商系统，减少后端开发量，学习价值高 |
| **图标库** | Lucide React | 现代、简洁、统一的图标风格 |
| **部署平台** | Netlify | 支持 rewrite，一键部署，CDN 全球加速 |
| **代码规范** | ESLint + Prettier + Husky + lint-staged | 保证代码质量，统一代码风格 |
| **SEO 优化** | React Helmet + vite-plugin-ssr + vite-plugin-sitemap | 动态 Meta 标签、预渲染、自动生成 sitemap |
| **物流追踪** | Shopify Fulfillment API + 物流服务商 API (17track/AfterShip) | 多物流商统一追踪接口 |
| **结构化数据** | Schema.org + JSON-LD | 提升搜索结果展示效果 |
| **AI 辅助** | claude.md + Skills + AGENTS.md | 规范化项目结构，提升 AI 生成代码质量 |

### 3.2 架构设计

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                 客户端                                  │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┤
│  浏览器  │  移动端  │   PWA   │         │         │         │         │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              前端应用层                                │
├─────────────────────────────────────────────────────────────────────────┤
│           React 应用（多语言路由、状态管理、UI 组件）                  │
├─────────────────────────────────────────────────────────────────────────┤
│                   API 适配层（统一接口封装，屏蔽后端差异）              │
├─────────────────────────────────────────────────────────────────────────┤
│                           电商后端服务层                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    Shopify 平台（当前）                         │  │
│  │  - Storefront API（商品、购物车、结算）                         │  │
│  │  - Customer API（用户、地址管理）                               │  │
│  │  - Checkout API（支付、订单）                                   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    自建后端（未来扩展）                         │  │
│  │  - Node.js + Express + PostgreSQL                              │  │
│  │  - 可无缝替换 Shopify                                          │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────┬─────────┬─────────┬─────────┐
│ 支付网关 │  物流   │  邮件   │  分析   │
│ Stripe  │ 服务商  │ 服务    │  GA4    │
│ PayPal  │         │         │         │
└─────────┴─────────┴─────────┴─────────┘
```

### 3.3 架构关键设计决策

#### 3.3.1 API 适配层模式
- 所有对 Shopify 的调用通过统一的 API 适配层
- 适配层定义标准接口，后续替换后端时只需修改适配层实现
- 降低前端与具体后端的耦合

**核心接口**：[IEcommerceAdapter](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/interface.ts)

#### 3.3.2 多语言子路径实现
- 使用 Netlify rewrite 配置实现 /zh/ 和 /en/ 子路径
- React Router 动态读取语言前缀
- 避免使用哈希或查询参数，保证 SEO 友好

#### 3.3.3 Shopify 无头模式
- 前端完全自主控制，不使用 Shopify 主题
- 通过 Storefront API 获取公开数据
- 敏感操作（支付、订单）通过 Shopify Checkout 处理

#### 3.3.4 状态管理分层
- 服务端状态：TanStack Query（API 数据缓存）
- 客户端状态：Zustand（购物车、用户、UI 状态）

---

## 四、项目目录结构

### 4.1 整体结构

```
ecommerce-store/
├── .trae/                          # AI 辅助开发配置
│   ├── documents/                  # 项目文档
│   │   ├── ecommerce_store_plan.md # 本计划文档
│   │   ├── phase_reports/          # 阶段报告
│   │   └── notifications/          # 通知文档
│   └── skills/                     # 自定义技能
├── public/                         # 静态资源
│   ├── locales/                    # 多语言翻译文件
│   │   ├── en/
│   │   │   ├── common.json         # 通用翻译
│   │   │   ├── product.json        # 商品相关
│   │   │   ├── cart.json           # 购物车相关
│   │   │   ├── user.json           # 用户相关
│   │   │   └── checkout.json       # 结算相关
│   │   └── zh/
│   │       ├── common.json
│   │       ├── product.json
│   │       ├── cart.json
│   │       ├── user.json
│   │       └── checkout.json
│   └── assets/                     # 图片、字体等
├── src/
│   ├── components/                 # 通用组件
│   │   ├── ui/                     # 基础 UI 组件
│   │   ├── product/                # 商品相关组件
│   │   ├── cart/                   # 购物车相关组件
│   │   ├── layout/                 # 布局组件
│   │   └── locale/                 # 多语言相关组件
│   ├── hooks/                      # 自定义 Hooks
│   ├── lib/                        # 工具库
│   │   ├── i18n/                   # 多语言配置
│   │   ├── shopify/                # Shopify 配置
│   │   ├── constants.ts            # 常量定义
│   │   └── utils.ts                # 工具函数
│   ├── pages/                      # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx        # ✅ Phase 5 新增
│   │   ├── OrderConfirmationPage.tsx # ✅ Phase 5 新增
│   │   ├── PaymentFailedPage.tsx    # ✅ Phase 5 新增
│   │   ├── OrdersPage.tsx           # ✅ Phase 5 新增
│   │   ├── OrderDetailPage.tsx      # ✅ Phase 5 新增
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── AccountPage.tsx
│   ├── services/                   # 服务层
│   │   ├── adapters/               # API 适配器
│   │   │   ├── interface.ts        # ✅ 适配器接口
│   │   │   ├── factory.ts          # ✅ 适配器工厂
│   │   │   ├── shopify/            # Shopify 适配器实现
│   │   │   └── mock/               # ✅ Mock 适配器（Phase 5 新增）
│   │   ├── productService.ts
│   │   ├── cartService.ts
│   │   ├── userService.ts
│   │   └── checkoutService.ts      # ✅ Phase 5 新增
│   ├── stores/                     # Zustand 状态管理
│   │   ├── cartStore.ts
│   │   ├── userStore.ts
│   │   ├── toastStore.ts
│   │   └── favoritesStore.ts
│   ├── types/                      # TypeScript 类型定义
│   │   ├── index.ts
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── user.ts
│   │   ├── order.ts
│   │   ├── checkout.ts             # ✅ Phase 5 新增
│   │   ├── common.ts
│   │   └── locale.ts
│   ├── App.tsx                     # 根组件
│   ├── main.tsx                    # 入口文件
│   └── index.css                   # 全局样式
├── .husky/                         # Git Hooks
├── netlify.toml                    # Netlify 部署配置
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── CLAUDE.md                       # AI 开发规范
└── AGENTS.md                       # AI 代理配置
```

### 4.2 关键文件说明

| 文件 | 用途 | 维护负责人 |
|------|------|-----------|
| [src/services/adapters/interface.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/interface.ts) | API 适配器接口 | 前端架构师 + Shopify 专家 |
| [src/services/adapters/shopify/index.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/shopify/index.ts) | Shopify 适配器实现 | Shopify 集成专家 |
| [src/services/adapters/mock/index.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/mock/index.ts) | Mock 适配器实现 | 前端架构师 |
| [src/services/checkoutService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/checkoutService.ts) | Checkout 服务层 | Shopify 集成专家 |
| [src/types/checkout.ts](file:///d:/Atemp/cc/ecommerce-store/src/types/checkout.ts) | Checkout 类型定义 | 前端架构师 |
| [src/pages/CheckoutPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/CheckoutPage.tsx) | 结算页面 | UI/UX 设计师 |
| [CLAUDE.md](file:///d:/Atemp/cc/ecommerce-store/CLAUDE.md) | AI 开发规范 | 所有代理 |
| [AGENTS.md](file:///d:/Atemp/cc/ecommerce-store/AGENTS.md) | AI 代理配置 | 所有代理 |

---

## 五、开发阶段规划

### 5.1 阶段总览

| 阶段编号 | 阶段名称 | 主要内容 | 预计时间 | 实际时间 | 优先级 | 状态 |
|----------|----------|----------|----------|----------|--------|------|
| **Phase 0** | 项目初始化 | 目录结构、配置文件、规范文档 | 1-2 天 | 1 天 | P0 | ✅ 完成 |
| **Phase 1** | 基础架构 | 多语言系统、路由、状态管理、API 适配层 | 3-5 天 | 3 天 | P0 | ✅ 完成 |
| **Phase 2** | 商品模块 | 商品列表、商品详情、分类筛选、搜索、收藏 | 5-7 天 | 5 天 | P0 | ✅ 完成 |
| **Phase 3** | 购物车模块 | 添加购物车、购物车列表、数量修改、价格计算、购物车抽屉 | 3-4 天 | 3 天 | P0 | ✅ 完成 |
| **Phase 4** | 用户模块 | 注册登录、个人中心、地址管理、订单管理 | 5-7 天 | 5 天 | P0 | ✅ 完成 |
| **Phase 5** | 订单支付 | 结算流程、支付集成、订单管理、折扣码 | 5-7 天 | 4 天 | P0 | ✅ 完成 |
| **Phase 6** | SEO 优化 | Meta 标签、sitemap、结构化数据、预渲染、多语言 SEO | 3-4 天 | 待开始 | P0 | ⏳ 规划中 |
| **Phase 7** | 物流追踪 | 物流信息展示、追踪地图、配送状态、多物流商集成 | 3-5 天 | 待开始 | P1 | ⏳ 规划中 |

### 5.2 阶段依赖关系

```
Phase 0 (项目初始化)
    ↓
Phase 1 (基础架构)
    ↓
Phase 2 (商品模块)
    ↓
Phase 3 (购物车模块)
    ↓
Phase 4 (用户模块)
    ↓
Phase 5 (订单支付)  ←─ ✅ 2026-06-04 完成
    ↓
Phase 6 (SEO 优化)  ←─ 当前阶段入口
    ↓
Phase 7 (物流追踪)  ←─ 下一阶段
```

---

## 六、各阶段详细任务

### ✅ Phase 0: 项目初始化

**完成日期**: 2026-05-31  
**Git Commit**: `0c69e4c`

| 任务编号 | 任务描述 | 状态 | 交付物 |
|----------|----------|------|--------|
| T0-01 | 创建项目目录结构 | ✅ 完成 | [项目结构](file:///d:/Atemp/cc/ecommerce-store/) |
| T0-02 | 初始化 Vite + React + TypeScript 项目 | ✅ 完成 | [package.json](file:///d:/Atemp/cc/ecommerce-store/package.json) |
| T0-03 | 配置 Tailwind CSS 4 | ✅ 完成 | [tailwind.config.js](file:///d:/Atemp/cc/ecommerce-store/tailwind.config.js) |
| T0-04 | 配置 ESLint + Prettier | ✅ 完成 | [.eslintrc.cjs](file:///d:/Atemp/cc/ecommerce-store/.eslintrc.cjs) |
| T0-05 | 配置 Git Hooks (Husky + lint-staged) | ✅ 完成 | [.husky/](file:///d:/Atemp/cc/ecommerce-store/.husky/) |
| T0-06 | 创建 CLAUDE.md 开发规范 | ✅ 完成 | [CLAUDE.md](file:///d:/Atemp/cc/ecommerce-store/CLAUDE.md) |
| T0-07 | 创建 AGENTS.md 代理配置 | ✅ 完成 | [AGENTS.md](file:///d:/Atemp/cc/ecommerce-store/AGENTS.md) |
| T0-08 | 配置 Netlify 部署 | ✅ 完成 | [netlify.toml](file:///d:/Atemp/cc/ecommerce-store/netlify.toml) |

### ✅ Phase 1: 基础架构

**完成日期**: 2026-06-01  
**Git Commit**: `65e0249`

| 任务编号 | 任务描述 | 状态 | 交付物 |
|----------|----------|------|--------|
| T1-01 | 多语言路由系统实现 | ✅ 完成 | [App.tsx](file:///d:/Atemp/cc/ecommerce-store/src/App.tsx) |
| T1-02 | i18next 配置 | ✅ 完成 | [src/lib/i18n/config.ts](file:///d:/Atemp/cc/ecommerce-store/src/lib/i18n/config.ts) |
| T1-03 | API 适配层接口定义 | ✅ 完成 | [interface.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/interface.ts) |
| T1-04 | Shopify 适配器基础实现 | ✅ 完成 | [shopify/index.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/shopify/index.ts) |
| T1-05 | Zustand 状态管理配置 | ✅ 完成 | [stores/](file:///d:/Atemp/cc/ecommerce-store/src/stores/) |
| T1-06 | TanStack Query 配置 | ✅ 完成 | [main.tsx](file:///d:/Atemp/cc/ecommerce-store/src/main.tsx) |
| T1-07 | 工具函数库 | ✅ 完成 | [utils.ts](file:///d:/Atemp/cc/ecommerce-store/src/lib/utils.ts) |
| T1-08 | 类型定义 | ✅ 完成 | [types/](file:///d:/Atemp/cc/ecommerce-store/src/types/) |

### ✅ Phase 2: 商品模块

**完成日期**: 2026-06-01  
**Git Commit**: `dcb1e18`

| 任务编号 | 任务描述 | 状态 | 交付物 |
|----------|----------|------|--------|
| T2-01 | 商品列表页面 | ✅ 完成 | [ProductsPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/ProductsPage.tsx) |
| T2-02 | 商品详情页面 | ✅ 完成 | [ProductDetailPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/ProductDetailPage.tsx) |
| T2-03 | 商品卡片组件 | ✅ 完成 | [ProductCard.tsx](file:///d:/Atemp/cc/ecommerce-store/src/components/product/ProductCard.tsx) |
| T2-04 | 商品分类筛选 | ✅ 完成 | [ProductsPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/ProductsPage.tsx) |
| T2-05 | 收藏功能 | ✅ 完成 | [favoritesStore.ts](file:///d:/Atemp/cc/ecommerce-store/src/stores/favoritesStore.ts) |
| T2-06 | 商品服务层 | ✅ 完成 | [productService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/productService.ts) |
| T2-07 | 商品多语言翻译 | ✅ 完成 | [product.json](file:///d:/Atemp/cc/ecommerce-store/public/locales/en/product.json) |

### ✅ Phase 3: 购物车模块

**完成日期**: 2026-06-02  
**Git Commit**: `58575a0`

| 任务编号 | 任务描述 | 状态 | 交付物 |
|----------|----------|------|--------|
| T3-01 | 添加到购物车功能 | ✅ 完成 | [useCartActions.ts](file:///d:/Atemp/cc/ecommerce-store/src/hooks/useCartActions.ts) |
| T3-02 | 购物车页面 | ✅ 完成 | [CartPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/CartPage.tsx) |
| T3-03 | 购物车抽屉组件 | ✅ 完成 | [CartDrawer.tsx](file:///d:/Atemp/cc/ecommerce-store/src/components/cart/CartDrawer.tsx) |
| T3-04 | 数量修改功能 | ✅ 完成 | [cartService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/cartService.ts) |
| T3-05 | 价格计算 | ✅ 完成 | [CartPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/CartPage.tsx) |
| T3-06 | 购物车服务层 | ✅ 完成 | [cartService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/cartService.ts) |
| T3-07 | 购物车状态管理 | ✅ 完成 | [cartStore.ts](file:///d:/Atemp/cc/ecommerce-store/src/stores/cartStore.ts) |
| T3-08 | 购物车多语言翻译 | ✅ 完成 | [cart.json](file:///d:/Atemp/cc/ecommerce-store/public/locales/en/cart.json) |

### ✅ Phase 4: 用户模块

**完成日期**: 2026-06-02  
**Git Commit**: `1d1db82`, `dfa6aeb`

| 任务编号 | 任务描述 | 状态 | 交付物 |
|----------|----------|------|--------|
| T4-01 | 用户注册功能 | ✅ 完成 | [RegisterPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/RegisterPage.tsx) |
| T4-02 | 用户登录功能 | ✅ 完成 | [LoginPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/LoginPage.tsx) |
| T4-03 | 个人中心页面 | ✅ 完成 | [AccountPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/AccountPage.tsx) |
| T4-04 | 地址管理功能 | ✅ 完成 | [AccountPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/AccountPage.tsx) |
| T4-05 | 用户服务层 | ✅ 完成 | [userService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/userService.ts) |
| T4-06 | 用户状态管理 | ✅ 完成 | [userStore.ts](file:///d:/Atemp/cc/ecommerce-store/src/stores/userStore.ts) |
| T4-07 | 用户多语言翻译 | ✅ 完成 | [user.json](file:///d:/Atemp/cc/ecommerce-store/public/locales/en/user.json) |
| T4-08 | 订单列表页面 | ✅ 完成 | [OrdersPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/OrdersPage.tsx) |
| T4-09 | 订单详情页面 | ✅ 完成 | [OrderDetailPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/OrderDetailPage.tsx) |

### ✅ Phase 5: 订单支付

**完成日期**: 2026-06-04  
**Git Commit**: `622f78e`

| 任务编号 | 任务描述 | 状态 | 交付物 |
|----------|----------|------|--------|
| T5-01 | Checkout API 集成 | ✅ 完成 | [shopify/index.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/shopify/index.ts) |
| T5-02 | Checkout 类型定义 | ✅ 完成 | [checkout.ts](file:///d:/Atemp/cc/ecommerce-store/src/types/checkout.ts) |
| T5-03 | Mock 适配器实现 | ✅ 完成 | [mock/index.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/mock/index.ts) |
| T5-04 | Checkout 服务层 | ✅ 完成 | [checkoutService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/checkoutService.ts) |
| T5-05 | 结算页面 | ✅ 完成 | [CheckoutPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/CheckoutPage.tsx) |
| T5-06 | 地址选择功能 | ✅ 完成 | [CheckoutPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/CheckoutPage.tsx) |
| T5-07 | 配送方式选择 | ✅ 完成 | [CheckoutPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/CheckoutPage.tsx) |
| T5-08 | 折扣码功能 | ✅ 完成 | [CheckoutPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/CheckoutPage.tsx) |
| T5-09 | 订单成功页面 | ✅ 完成 | [OrderConfirmationPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/OrderConfirmationPage.tsx) |
| T5-10 | 支付失败页面 | ✅ 完成 | [PaymentFailedPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/PaymentFailedPage.tsx) |
| T5-11 | Checkout 多语言翻译 | ✅ 完成 | [checkout.json](file:///d:/Atemp/cc/ecommerce-store/public/locales/en/checkout.json) |
| T5-12 | 适配器接口扩展 | ✅ 完成 | [interface.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/interface.ts) |

### ⏳ Phase 6: SEO 优化

**预计开始**: 2026-06-05  
**预计完成**: 2026-06-08  
**预计工时**: 3-4 天

| 任务编号 | 任务描述 | 状态 | 交付物 |
|----------|----------|------|--------|
| T6-01 | Meta 标签管理组件 | ⏳ 规划中 | [src/components/seo/SeoMeta.tsx] |
| T6-02 | 自动生成 sitemap.xml | ⏳ 规划中 | `public/sitemap.xml` |
| T6-03 | robots.txt 配置 | ⏳ 规划中 | `public/robots.txt` |
| T6-04 | 结构化数据 (Schema.org) | ⏳ 规划中 | [src/lib/seo/schema.ts] |
| T6-05 | Open Graph / Twitter Card | ⏳ 规划中 | [src/components/seo/SocialMeta.tsx] |
| T6-06 | 多语言 hreflang 标签 | ⏳ 规划中 | [src/components/seo/HreflangTags.tsx] |
| T6-07 | 关键页面预渲染配置 | ⏳ 规划中 | `vite.config.ts` 配置 |
| T6-08 | 预渲染商品列表和详情 | ⏳ 规划中 | 预渲染页面 |
| T6-09 | 预渲染首页和分类页 | ⏳ 规划中 | 预渲染页面 |
| T6-10 | 图片 SEO (alt 文本、文件名优化 | ⏳ 规划中 | 组件更新 |
| T6-11 | URL 结构优化 | ⏳ 规划中 | 路由配置更新 |
| T6-12 | SEO 多语言翻译 | ⏳ 规划中 | `seo.json` 翻译文件 |
| T6-13 | SEO 效果检测与优化 | ⏳ 规划中 | 测试报告 |
| T6-14 | Google Search Console 配置 | ⏳ 规划中 | 配置文档 |
| T6-15 | 性能优化（LCP、FID、CLS） | ⏳ 规划中 | 性能优化报告 |

---

### ⏳ Phase 7: 物流追踪

**预计开始**: 2026-06-09  
**预计完成**: 2026-06-13  
**预计工时**: 3-5 天

| 任务编号 | 任务描述 | 状态 | 交付物 |
|----------|----------|------|--------|
| T7-01 | 物流追踪类型定义 | ⏳ 规划中 | [src/types/fulfillment.ts] |
| T7-02 | 适配器接口扩展（Fulfillment API） | ⏳ 规划中 | [src/services/adapters/interface.ts] |
| T7-03 | Shopify Fulfillment API 集成 | ⏳ 规划中 | [src/services/adapters/shopify/index.ts] |
| T7-04 | 物流服务商 API 集成（17track/AfterShip） | ⏳ 规划中 | [src/services/fulfillment/trackingProvider.ts] |
| T7-05 | 物流服务层 | ⏳ 规划中 | [src/services/fulfillmentService.ts] |
| T7-06 | 物流追踪页面 | ⏳ 规划中 | [src/pages/TrackingPage.tsx] |
| T7-07 | 物流状态组件 | ⏳ 规划中 | [src/components/fulfillment/FulfillmentStatus.tsx] |
| T7-08 | 物流时间线组件 | ⏳ 规划中 | [src/components/fulfillment/TrackingTimeline.tsx] |
| T7-09 | 物流地图组件 | ⏳ 规划中 | [src/components/fulfillment/TrackingMap.tsx] |
| T7-10 | 订单详情页物流信息集成 | ⏳ 规划中 | [src/pages/OrderDetailPage.tsx] 更新 |
| T7-11 | 物流状态推送通知 | ⏳ 规划中 | [src/components/fulfillment/Notification.tsx] |
| T7-12 | 物流多语言翻译 | ⏳ 规划中 | `fulfillment.json` 翻译文件 |
| T7-13 | Mock 适配器物流追踪实现 | ⏳ 规划中 | [src/services/adapters/mock/index.ts] 更新 |
| T7-14 | 物流追踪流程测试 | ⏳ 规划中 | 测试报告 |
| T7-15 | 多物流商适配架构设计 | ⏳ 规划中 | 技术设计文档 |

---

## 七、API 适配层设计

### 7.1 核心接口定义

**文件**: [interface.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/interface.ts)

```typescript
export interface IEcommerceAdapter {
  // 商品相关
  getProducts(filter?: ProductFilter): Promise<ProductConnection>
  getProduct(handle: string): Promise<Product | null>
  getProductRecommendations(productId: string): Promise<Product[]>
  getCollections(): Promise<CollectionConnection>
  getCollection(handle: string): Promise<Collection | null>

  // 购物车相关
  createCart(input?: CartInput): Promise<Cart>
  getCart(cartId: string): Promise<Cart | null>
  addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart>
  updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart>
  removeCartLines(cartId: string, lineIds: string[]): Promise<Cart>
  updateCartBuyerIdentity(...)

  // 用户相关
  createCustomer(input: CustomerCreateInput): Promise<{...}>
  loginCustomer(email: string, password: string): Promise<{...}>
  getCustomer(token: string): Promise<Customer | null>
  updateCustomer(token: string, input: CustomerUpdateInput): Promise<{...}>
  getCustomerOrders(token: string): Promise<OrderConnection>

  // ✅ Checkout 相关（Phase 5 新增）
  createCheckout(input?: CheckoutCreateInput): Promise<Checkout>
  getCheckout(checkoutId: string): Promise<Checkout | null>
  updateCheckout(checkoutId: string, input: CheckoutUpdateInput): Promise<CheckoutResult>
  updateCheckoutShippingAddress(...): Promise<CheckoutResult>
  getAvailableShippingRates(checkoutId: string): Promise<ShippingRate[]>
  updateCheckoutShippingLine(...): Promise<CheckoutResult>
  applyDiscountCode(checkoutId: string, discountCode: string): Promise<CheckoutResult>
  removeDiscountCode(checkoutId: string): Promise<CheckoutResult>
  completeCheckout(checkoutId: string): Promise<{order?: Order; userErrors: CheckoutUserError[]}>
}
```

### 7.2 适配器实现

| 适配器 | 用途 | 状态 |
|--------|------|------|
| [ShopifyAdapter](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/shopify/index.ts) | 生产环境，调用真实 Shopify API | ✅ 完成 |
| [MockAdapter](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/mock/index.ts) | 开发测试，返回模拟数据 | ✅ 完成 |

### 7.3 服务层封装

| 服务文件 | 功能 |
|----------|------|
| [productService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/productService.ts) | 商品相关 React Query Hooks |
| [cartService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/cartService.ts) | 购物车相关 React Query Hooks |
| [userService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/userService.ts) | 用户相关 React Query Hooks |
| [checkoutService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/checkoutService.ts) | ✅ Checkout 相关 React Query Hooks |

---

## 八、Checkout 模块设计（Phase 5 新增）

### 8.1 Checkout 流程

```
购物车页面
    ↓
点击「去结算」
    ↓
创建 Checkout
    ↓
Information 步骤：填写邮箱、选择/填写配送地址
    ↓
Shipping 步骤：选择配送方式
    ↓
Payment 步骤：确认订单，点击「去支付」
    ↓
跳转到 Shopify 官方支付页面
    ↓
支付成功 → 订单成功页面
支付失败 → 支付失败页面
```

### 8.2 Checkout 页面功能

| 功能模块 | 描述 | 状态 |
|----------|------|------|
| 步骤指示器 | 显示当前结算进度 | ✅ 完成 |
| 地址选择 | 从用户地址簿选择或新增地址 | ✅ 完成 |
| 配送方式选择 | 根据地址获取可用配送方式 | ✅ 完成 |
| 折扣码 | 应用/移除折扣码 | ✅ 完成 |
| 订单摘要 | 实时显示商品、运费、税费、折扣、总计 | ✅ 完成 |
| 响应式设计 | 适配移动端和桌面端 | ✅ 完成 |

### 8.3 Checkout API 列表

| API 方法 | 用途 |
|----------|------|
| `createCheckout` | 创建新的 Checkout |
| `getCheckout` | 获取 Checkout 详情 |
| `updateCheckout` | 更新 Checkout 基本信息 |
| `updateCheckoutShippingAddress` | 更新配送地址 |
| `getAvailableShippingRates` | 获取可用配送方式 |
| `updateCheckoutShippingLine` | 选择配送方式 |
| `applyDiscountCode` | 应用折扣码 |
| `removeDiscountCode` | 移除折扣码 |
| `completeCheckout` | 完成 Checkout（免费订单） |

---

## 九、支付系统设计

### 9.1 支付流程

1. **前端创建 Checkout** → 获取 Shopify Checkout URL
2. **跳转到 Shopify 支付页面** → 用户完成支付
3. **Shopify 处理支付** → 调用支付网关
4. **支付结果回调** → 跳转到成功/失败页面
5. **前端验证订单** → 显示订单详情

### 9.2 支付方式

| 支付方式 | 实现方式 | 支持地区 |
|----------|----------|----------|
| **信用卡** | Shopify Payments 内置 | 全球 |
| **PayPal** | Shopify Payments 内置 | 全球 |
| **Apple Pay** | Shopify Payments 内置 | 支持 Apple Pay 的地区 |
| **Google Pay** | Shopify Payments 内置 | 支持 Google Pay 的地区 |

### 9.3 支付安全
- 所有支付流程走 Shopify 官方页面，不接触信用卡信息
- 使用 HTTPS 加密传输
- 订单状态需要服务端验证，不依赖前端传递

---

## 十、物流追踪模块设计（Phase 7 规划）

### 10.1 物流追踪流程

```
订单支付成功
    ↓
Shopify 生成订单
    ↓
商家发货（Fulfillment 创建）
    ↓
获取物流追踪号
    ↓
调用物流服务商 API
    ↓
用户查看物流追踪页面
    ↓
实时显示物流状态时间线
    ↓
（可选）地图展示配送位置
    ↓
（可选）物流状态更新推送
```

### 10.2 物流追踪功能模块

| 功能模块 | 功能描述 | 优先级 | 状态 |
|----------|----------|--------|------|
| **物流类型定义** | Fulfillment、TrackingInfo、TrackingEvent 等类型 | P0 | ⏳ 规划中 |
| **适配器接口扩展** | Fulfillment 相关 API 方法 | P0 | ⏳ 规划中 |
| **Shopify Fulfillment API 集成** | 获取订单物流信息 | P0 | ⏳ 规划中 |
| **多物流商适配层** | 统一 17track、AfterShip 等物流商 API | P1 | ⏳ 规划中 |
| **物流服务层** | React Query Hooks 封装 | P0 | ⏳ 规划中 |
| **物流追踪页面** | `/tracking?orderId=xxx` 追踪号查询 | P0 | ⏳ 规划中 |
| **物流状态组件** | 显示当前物流状态（待发货、已发货、运输中、已签收） | P0 | ⏳ 规划中 |
| **物流时间线组件** | 展示物流节点时间线 | P0 | ⏳ 规划中 |
| **物流地图组件** | 展示配送位置地图（可选，集成 Google Maps / 高德） | P2 | ⏳ 规划中 |
| **订单详情集成** | 在订单详情页显示物流信息 | P0 | ⏳ 规划中 |
| **物流状态推送** | WebSocket / 轮询获取最新物流状态 | P1 | ⏳ 规划中 |
| **多语言翻译** | 物流相关文案翻译 | P0 | ⏳ 规划中 |

### 10.3 物流状态定义

| 状态 | 说明 | 图标 |
|------|------|------|
| `PENDING` | 待发货 | `Package` |
| `CONFIRMED` | 订单已确认 | `CheckCircle` |
| `PROCESSING` | 商家处理中 | `RefreshCw` |
| `IN_TRANSIT` | 运输中 | `Truck` |
| `OUT_FOR_DELIVERY` | 派送中 | `MapPin` |
| `DELIVERED` | 已签收 | `CheckCircle2` |
| `FAILED` | 派送失败 | `AlertTriangle` |
| `RETURNED` | 已退回 | `ArrowLeft` |

### 10.4 核心 API 接口设计

```typescript
// 适配器接口扩展
export interface IEcommerceAdapter {
  // ... 已有方法 ...

  // ✅ Fulfillment 相关（Phase 7 新增）
  getFulfillments(orderId: string): Promise<Fulfillment[]>
  getFulfillment(fulfillmentId: string): Promise<Fulfillment | null>
  getTrackingInfo(fulfillmentId: string): Promise<TrackingInfo | null>
  getTrackingEvents(trackingNumber: string, carrier: string): Promise<TrackingEvent[]>
  refreshTracking(trackingNumber: string, carrier: string): Promise<TrackingInfo>
}
```

### 10.5 核心类型定义

```typescript
// src/types/fulfillment.ts

export enum FulfillmentStatus {
  PENDING = 'PENDING',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  ERROR = 'ERROR',
}

export enum TrackingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERY_ATTEMPT = 'DELIVERY_ATTEMPT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED',
  UNKNOWN = 'UNKNOWN',
}

export interface TrackingEvent {
  id: string
  status: TrackingStatus
  message: string
  location?: string
  timestamp: string
  detail?: string
}

export interface TrackingInfo {
  id: string
  trackingNumber: string
  carrier: string
  status: TrackingStatus
  events: TrackingEvent[]
  estimatedDeliveryAt?: string
  shippedAt?: string
  deliveredAt?: string
  origin?: string
  destination?: string
  weight?: string
  serviceName?: string
}

export interface FulfillmentLineItem {
  id: string
  quantity: number
  title: string
  variantTitle?: string
  imageUrl?: string
}

export interface Fulfillment {
  id: string
  orderId: string
  status: FulfillmentStatus
  trackingNumber?: string
  trackingCompany?: string
  trackingUrl?: string
  trackingInfo?: TrackingInfo
  lineItems: FulfillmentLineItem[]
  createdAt: string
  updatedAt: string
  estimatedDeliveryAt?: string
  deliveredAt?: string
  carrierIdentifier?: string
  service?: string
  shippingMethod?: string
  originAddress?: MailingAddress
  destinationAddress?: MailingAddress
}
```

### 10.6 物流服务商集成架构

```
┌─────────────────────────────────────────────────────────────────┐
│                      前端应用层                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐    │
│  │ TrackingPage│  │ OrderDetail │  │ FulfillmentService   │    │
│  └─────────────┘  └─────────────┘  └──────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    物流服务适配层                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 TrackingProvider (接口)                 │    │
│  │  - getTrackingInfo(trackingNumber, carrier)             │    │
│  │  - getTrackingEvents(trackingNumber, carrier)           │    │
│  └─────────────────────────────────────────────────────────┘    │
│           │                    │                    │            │
│           ▼                    ▼                    ▼            │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │ 17track      │     │ AfterShip    │     │ 自定义       │    │
│  │ Provider     │     │ Provider     │     │ Provider     │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 10.7 物流追踪页面设计

**页面路径**: `/:locale/tracking`
**查询参数**: `orderId` (订单 ID), `trackingNumber` (追踪号), `carrier` (物流公司)

**页面结构**:
```
物流追踪页面
├── 搜索框（输入追踪号查询）
├── 订单信息卡片
│   ├── 订单编号
│   ├── 商品概要
│   └── 收货地址
├── 当前物流状态
│   ├── 状态图标
│   ├── 状态文本
│   └── 预计送达时间
├── 物流时间线
│   ├── [已签收] 时间 + 地点 + 详情
│   ├── [派送中] 时间 + 地点 + 详情
│   ├── [运输中] 时间 + 地点 + 详情
│   └── [已发货] 时间 + 地点 + 详情
└── （可选）配送地图
    └── 实时显示包裹位置
```

### 10.8 多物流商支持

| 物流商 | 支持地区 | API | 状态 |
|--------|----------|-----|------|
| **17track** | 全球 | 免费 API | ⏳ 规划中 |
| **AfterShip** | 全球 | 付费 API | ⏳ 规划中 |
| **顺丰** | 中国 | 企业 API | ⏳ 规划中 |
| **EMS** | 中国 | 官方 API | ⏳ 规划中 |
| **USPS** | 美国 | 官方 API | ⏳ 规划中 |
| **DHL** | 全球 | 官方 API | ⏳ 规划中 |

---

## 十一、SEO 优化设计（Phase 6 规划）

### 11.1 SEO 目标

- **核心目标**: 提升搜索引擎排名，增加自然流量
- **LCP (最大内容绘制)**: < 2.5s
- **FID (首次输入延迟)**: < 100ms
- **CLS (累计布局偏移)**: < 0.1
- **目标关键词**: 覆盖产品词、品牌词、长尾词
- **多语言 SEO**: 中英文独立收录，`hreflang` 正确配置

### 11.2 SEO 技术架构

```
┌─────────────────────────────────────────────────────────────────┐
│                      SEO 优化架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  页面级 SEO                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │ Meta 标签    │  │ OG 标签      │  │ Twitter Card │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │ 结构化数据   │  │ hreflang     │  │ 图片优化     │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  技术 SEO                                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │ sitemap.xml  │  │ robots.txt   │  │ 预渲染 (SSR) │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │ URL 优化     │  │ 性能优化     │  │ 移动端优化   │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  内容 SEO                                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │ 关键词优化   │  │ 内容质量     │  │ 内部链接     │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.3 Meta 标签设计

**核心组件**: `src/components/seo/SeoMeta.tsx`

```tsx
interface SeoMetaProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'product' | 'article'
  url?: string
  noIndex?: boolean
}

// 使用示例
<SeoMeta
  title={`${product.title} | Maison Artisan`}
  description={product.description}
  keywords={[product.productType, product.tags?.join(', ')]}
  image={product.featuredImage?.url}
  type="product"
  url={`https://example.com/${locale}/products/${product.handle}`}
/>
```

**生成的 Meta 标签**:
```html
<!-- 基础 Meta -->
<title>商品名称 | Maison Artisan</title>
<meta name="description" content="商品描述...">
<meta name="keywords" content="关键词1, 关键词2, 关键词3">
<meta name="robots" content="index, follow">

<!-- Open Graph -->
<meta property="og:title" content="商品名称 | Maison Artisan">
<meta property="og:description" content="商品描述...">
<meta property="og:image" content="https://...">
<meta property="og:type" content="product">
<meta property="og:url" content="https://example.com/en/products/xxx">
<meta property="og:site_name" content="Maison Artisan">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="zh_CN">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="商品名称 | Maison Artisan">
<meta name="twitter:description" content="商品描述...">
<meta name="twitter:image" content="https://...">

<!-- 多语言 hreflang -->
<link rel="alternate" hreflang="en" href="https://example.com/en/products/xxx">
<link rel="alternate" hreflang="zh" href="https://example.com/zh/products/xxx">
<link rel="alternate" hreflang="x-default" href="https://example.com/en/products/xxx">
```

### 11.4 结构化数据 (Schema.org)

**核心文件**: `src/lib/seo/schema.ts`

```typescript
// 商品结构化数据
function getProductSchema(product: Product): object {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.featuredImage?.url,
    "brand": {
      "@type": "Brand",
      "name": product.vendor
    },
    "sku": product.variants?.edges?.[0]?.node.sku,
    "offers": {
      "@type": "Offer",
      "priceCurrency": product.variants?.edges?.[0]?.node.price.currencyCode,
      "price": product.variants?.edges?.[0]?.node.price.amount,
      "availability": product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://example.com/products/${product.handle}`
    },
    "aggregateRating": product.reviews ? {
      "@type": "AggregateRating",
      "ratingValue": product.reviews.averageRating,
      "reviewCount": product.reviews.totalCount
    } : undefined
  }
}

// 面包屑导航结构化数据
function getBreadcrumbSchema(items: { name: string; url: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

// 组织信息结构化数据
function getOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Maison Artisan",
    "url": "https://example.com",
    "logo": "https://example.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@example.com",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://facebook.com/maisonartisan",
      "https://instagram.com/maisonartisan"
    ]
  }
}
```

### 11.5 Sitemap 自动生成

**配置文件**: `vite.config.ts` 集成 `vite-plugin-sitemap`

```typescript
// vite.config.ts
import { SitemapConfig } from 'vite-plugin-sitemap'

const sitemapConfig: SitemapConfig = {
  hostname: 'https://example.com',
  dynamicRoutes: async () => {
    // 动态获取商品和分类
    const products = await fetchAllProducts()
    const collections = await fetchAllCollections()
    
    const routes: string[] = []
    
    // 静态路由
    ;['en', 'zh'].forEach(lang => {
      routes.push(`/${lang}/`)
      routes.push(`/${lang}/products`)
      routes.push(`/${lang}/cart`)
      routes.push(`/${lang}/account`)
      routes.push(`/${lang}/login`)
      routes.push(`/${lang}/register`)
    })
    
    // 商品详情页
    products.forEach(product => {
      ;['en', 'zh'].forEach(lang => {
        routes.push(`/${lang}/products/${product.handle}`)
      })
    })
    
    // 分类页
    collections.forEach(collection => {
      ;['en', 'zh'].forEach(lang => {
        routes.push(`/${lang}/collections/${collection.handle}`)
      })
    })
    
    return routes
  },
  changefreq: 'daily',
  priority: (route) => {
    if (route.endsWith('/')) return 1.0
    if (route.includes('/products/')) return 0.9
    if (route.includes('/collections/')) return 0.8
    return 0.7
  },
}
```

### 11.6 Robots.txt 配置

**文件**: `public/robots.txt`

```txt
# https://example.com/robots.txt
User-agent: *
Allow: /

# 禁止爬取的路径
Disallow: /admin/
Disallow: /checkout/
Disallow: /cart/
Disallow: /account/
Disallow: /login/
Disallow: /register/
Disallow: /*?*sort=
Disallow: /*?*page=
Disallow: /*?*filter=

# sitemap
Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/sitemap-zh.xml
```

### 11.7 预渲染 (SSR / SSG)

**技术方案**: 使用 `vite-plugin-ssr` 或 `vite-plugin-prerender`

**预渲染页面清单**:
- ✅ 首页 (`/`)
- ✅ 商品列表页 (`/products`)
- ✅ 商品详情页 (`/products/:handle`) - 动态渲染
- ✅ 分类列表页 (`/collections`)
- ✅ 分类详情页 (`/collections/:handle`)
- ✅ 关于我们、联系我们等静态页面

**预渲染优势**:
1. 搜索引擎爬虫可以直接抓取完整 HTML
2. 提升首屏加载速度
3. 改善社交媒体分享时的预览效果
4. 不影响客户端交互体验

### 11.8 多语言 SEO 策略

| 策略 | 实现方式 | 状态 |
|------|----------|------|
| **子路径 URL** | `/en/` 和 `/zh/` 前缀 | ✅ 已实现 |
| **hreflang 标签** | 动态生成 `hreflang` 标签 | ⏳ 规划中 |
| **独立 sitemap** | 为每种语言生成独立 sitemap | ⏳ 规划中 |
| **本地化内容** | UI 翻译 + 商品内容（可选） | ⏳ 规划中 |
| **本地化域名** | 可扩展为 `en.example.com` / `zh.example.com` | ⏳ 待考虑 |

### 11.9 性能优化对 SEO 的影响

**Core Web Vitals 优化目标**:

| 指标 | 目标 | 优化措施 |
|------|------|----------|
| **LCP** | < 2.5s | 图片优化、CDN 加速、预加载关键资源 |
| **FID** | < 100ms | 代码分割、减少 JavaScript 体积、懒加载 |
| **CLS** | < 0.1 | 图片尺寸预留、避免布局偏移、异步加载样式 |

### 11.10 SEO 组件目录结构

```
src/
├── components/
│   └── seo/
│       ├── SeoMeta.tsx          # Meta 标签管理组件
│       ├── SocialMeta.tsx       # OG / Twitter Card 组件
│       ├── HreflangTags.tsx     # 多语言 hreflang 标签
│       ├── StructuredData.tsx   # 结构化数据组件
│       └── BreadcrumbSchema.tsx # 面包屑导航 Schema
├── lib/
│   └── seo/
│       ├── schema.ts            # Schema.org 生成函数
│       ├── meta.ts              # Meta 标签生成工具
│       └── config.ts            # SEO 配置
└── hooks/
    └── useSeo.ts                # SEO 相关 Hook
```

### 11.11 SEO 检测工具

- **Google Search Console**: 索引状态、搜索性能
- **Google PageSpeed Insights**: 性能检测
- **Rich Results Test**: 结构化数据检测
- **Ahrefs / SEMrush**: 关键词排名、反向链接
- **Lighthouse**: 综合性能和 SEO 评分

### 11.12 SEO 多语言翻译文件

```json
// public/locales/en/seo.json
{
  "titleSuffix": "Maison Artisan",
  "description": {
    "home": "Discover unique handcrafted products at Maison Artisan. Free shipping worldwide.",
    "products": "Browse our collection of handcrafted products. High quality, unique designs.",
    "cart": "Review your cart and proceed to checkout at Maison Artisan.",
    "checkout": "Complete your purchase securely at Maison Artisan."
  },
  "keywords": {
    "home": "handcrafted, artisan, unique gifts, home decor",
    "products": "handcrafted products, artisan goods, unique gifts"
  }
}
```

---

## 十二、多语言系统设计

### 12.1 语言策略
- **默认语言**：英文（/en/）
- **第二语言**：中文（/zh/）
- **内容策略**：UI 界面翻译，商品内容统一英文（降低维护成本）
- **扩展预留**：设计上支持更多语言（日语、韩语等）

### 12.2 URL 结构

```
https://example.com/en/products          # 英文商品列表
https://example.com/zh/products          # 中文商品列表
https://example.com/en/products/123      # 英文商品详情
https://example.com/zh/products/123      # 中文商品详情
https://example.com/en/checkout          # 英文结算页面
https://example.com/zh/checkout          # 中文结算页面
```

### 12.3 翻译文件结构

```
public/locales/
├── en/
│   ├── common.json        # 通用翻译（按钮、表单等）
│   ├── product.json       # 商品相关
│   ├── cart.json          # 购物车相关
│   ├── user.json          # 用户相关
│   └── checkout.json      # ✅ 结算相关
└── zh/
    ├── common.json
    ├── product.json
    ├── cart.json
    ├── user.json
    └── checkout.json      # ✅ 结算相关
```

---

## 十三、部署方案

### 13.1 部署架构
- **前端**：Netlify（自动 CI/CD、全球 CDN、边缘计算）
- **后端**：Shopify（SaaS 服务，无需运维）
- **域名**：自定义域名 + SSL 证书（Netlify 自动管理）
- **DNS**：Cloudflare（可选，额外的 CDN 和安全防护）

### 13.2 环境配置

| 环境 | 域名 | Shopify 版本 | 适配器 |
|------|------|-------------|--------|
| **开发环境** | localhost:5173 | 开发店铺 | Mock / Shopify |
| **测试环境** | test.yourdomain.com | 开发店铺 | Shopify |
| **生产环境** | www.yourdomain.com | 正式店铺 | Shopify |

### 13.3 Netlify 配置要点
- `netlify.toml` 配置 rewrite 规则实现多语言子路径
- 环境变量管理（Shopify API Key、域名等）
- 自定义域名和 HTTPS 配置
- 部署钩子配置（Git push 自动部署）

---

## 十四、风险评估与应对

### 14.1 技术风险

| 风险 | 概率 | 影响 | 应对措施 | 状态 |
|------|------|------|----------|------|
| Shopify API 限制 | 中 | 中 | 合理使用缓存，设计 fallback 方案 | ✅ 已考虑 |
| 多语言路由复杂 | 中 | 中 | 充分调研，先做技术验证 | ✅ 已解决 |
| 支付流程复杂 | 高 | 高 | 使用 Shopify 官方 Checkout，降低风险 | ✅ 已解决 |
| 性能不达标 | 中 | 中 | 提前做性能规划，使用图片 CDN | ⏳ 待优化（Phase 6） |
| SEO 效果差 | 中 | 高 | 配置完善的 meta 标签，预渲染关键页面 | ⏳ 规划中（Phase 6） |
| **物流 API 不稳定** | 中 | 中 | 多物流商备份，设计重试机制 | ⏳ 规划中（Phase 7） |
| **多物流商适配复杂** | 中 | 中 | 抽象 Provider 接口，统一适配层 | ⏳ 规划中（Phase 7） |
| **预渲染配置复杂** | 低 | 中 | 选择成熟的 Vite 插件，从简单开始 | ⏳ 规划中（Phase 6） |
| **结构化数据错误** | 低 | 低 | 使用 Google Rich Results 测试验证 | ⏳ 规划中（Phase 6） |

### 14.2 业务风险

| 风险 | 概率 | 影响 | 应对措施 | 状态 |
|------|------|------|----------|------|
| Shopify 费用超支 | 低 | 中 | 关注使用量，选择合适的套餐 | ✅ 已考虑 |
| 支付账户审核 | 中 | 高 | 提前准备企业资料，尽早申请 | ⏳ 待处理 |
| 物流对接复杂 | 中 | 中 | MVP 阶段使用 Shopify 自带物流 | ✅ 已规划（Phase 7） |
| 数据迁移困难 | 低 | 高 | 适配器模式设计，降低耦合 | ✅ 已实现 |
| **物流成本超支** | 中 | 中 | 对比多家物流商，设置运费阈值 | ⏳ 规划中（Phase 7） |
| **SEO 排名提升缓慢** | 高 | 中 | 内容持续优化，外链建设，长期运营 | ⏳ 规划中（Phase 6+） |
| **多语言内容维护成本** | 中 | 中 | 初期只翻译 UI，商品内容统一英文 | ✅ 已规划 |

### 14.3 个人开发风险

| 风险 | 概率 | 影响 | 应对措施 | 状态 |
|------|------|------|----------|------|
| 技术学习曲线 | 中 | 中 | 分阶段学习，边做边学 | ✅ 执行中 |
| 开发周期过长 | 高 | 中 | MVP 最小化，快速上线 | ✅ 执行中 |
| 需求蔓延 | 高 | 高 | 严格控制范围，后续迭代再加功能 | ✅ 执行中 |
| 代码质量下降 | 中 | 中 | 建立规范，AI 辅助审查 | ✅ 已实现 |

---

## 十五、关键技术难点与解决方案

### 15.1 多语言子路径实现
**难点**：纯前端 SPA 如何实现 /zh/、/en/ 这样的服务端路由

**解决方案**：
- 使用 Netlify 的 rewrite 功能，将所有 /zh/* 和 /en/* 请求重写到 /index.html
- React Router 动态读取 URL 中的语言前缀

### 15.2 Shopify 无头模式集成
**难点**：Storefront API 权限限制，部分操作需要 Admin API

**解决方案**：
- 公开数据（商品、分类）使用 Storefront API
- 敏感操作（订单、用户）通过 Shopify 官方页面跳转
- 自定义逻辑通过 API 适配层封装，便于后续替换

### 15.3 购物车状态同步
**难点**：多设备购物车同步，用户登录后合并购物车

**解决方案**：
- 使用 Shopify Cart ID 标识购物车
- 未登录用户购物车 ID 存在 localStorage
- 用户登录后调用 Shopify API 合并购物车

### 13.4 ✅ Checkout 流程设计
**难点**：结算流程复杂，涉及地址、配送、支付等多个环节

**解决方案**：
- 分步骤设计（Information → Shipping → Payment）
- 使用 Shopify 官方 Checkout 处理支付
- 实时更新订单摘要，提供良好的用户反馈

### 15.5 SEO 优化
**难点**：纯前端 SPA 的 SEO 不友好

**解决方案**：
- 使用 Vite 插件配置预渲染
- 关键页面（首页、商品列表、商品详情）预渲染
- 动态生成 sitemap.xml 和 robots.txt
- 配置完善的 Open Graph 和 Twitter Card 标签
- 实现结构化数据（Schema.org）提升搜索展示效果
- 多语言 hreflang 标签配置，确保搜索引擎正确识别

### 15.6 物流追踪（Phase 7 新增）
**难点**：多物流商 API 对接，数据格式不统一，物流状态实时更新

**解决方案**：
- 抽象 TrackingProvider 接口，统一不同物流商的 API
- 支持 17track、AfterShip 等主流物流追踪服务
- 设计重试机制和缓存策略，应对 API 不稳定
- 使用轮询或 WebSocket 实现物流状态实时更新
- 物流状态枚举统一映射，确保前端展示一致

### 15.7 预渲染配置（Phase 6 新增）
**难点**：动态路由预渲染，多语言页面处理，避免过度渲染

**解决方案**：
- 针对关键页面（首页、商品列表、商品详情、分类页）进行预渲染
- 使用 vite-plugin-sitemap 自动生成多语言 sitemap
- 动态获取商品和分类列表进行全量预渲染
- 为预渲染页面设置合理的缓存策略
- 非关键页面保持客户端渲染，平衡渲染成本和 SEO 效果

---

## 十六、后续扩展方向

### 16.1 功能扩展
- [ ] 商品评论系统
- [ ] 优惠券/促销系统
- [ ] 会员等级/积分系统
- [ ] 商品推荐/相关商品
- [ ] 站内信/通知系统
- [ ] 数据分析看板
- [ ] 多店铺/多供应商
- [ ] 多货币支持
- [x] **物流追踪功能**（Phase 7 规划中）
- [ ] **SEO 持续优化**（Phase 6 规划中）
- [ ] 物流状态推送通知
- [ ] 多物流商比价功能
- [ ] 物流保险服务
- [ ] 结构化数据扩展（文章、FAQ、视频等）

### 16.2 技术扩展
- [ ] PWA 支持（离线浏览、添加到桌面）
- [ ] 后端迁移到 Node.js + Express + PostgreSQL
- [ ] 引入微前端架构
- [ ] 接入 AI 客服机器人
- [ ] 接入搜索服务（Algolia/Elasticsearch）
- [ ] A/B 测试系统
- [ ] **SEO 技术扩展**：AMP 支持、动态渲染
- [ ] **物流技术扩展**：实时位置追踪、物联网集成

### 16.3 运维扩展
- [ ] 接入监控系统（Sentry、LogRocket）
- [ ] 性能监控（Web Vitals）
- [ ] 错误追踪和告警
- [ ] 自动化测试（单元测试、E2E 测试）
- [ ] CI/CD 流水线完善

---

## 十七、学习资源清单

### 17.1 Shopify 开发
- Shopify 官方文档：https://shopify.dev/docs
- Shopify Storefront API：https://shopify.dev/docs/api/storefront
- Shopify Fulfillment API：https://shopify.dev/docs/api/admin-rest/2024-07/resources/fulfillment
- Hydrogen（Shopify 官方 React 框架）：https://hydrogen.shopify.dev/

### 17.2 多语言开发
- i18next 官方文档：https://www.i18next.com/
- react-i18next：https://react.i18next.com/

### 17.3 电商开发
- 电商 UI 设计参考：https://dribbble.com/search/ecommerce
- 电商用户体验指南：https://www.nngroup.com/articles/ecommerce-user-experience/
- 支付流程设计：https://baymard.com/checkout-usability

### 17.4 SEO 开发
- Google Search Central：https://developers.google.com/search
- Schema.org 结构化数据：https://schema.org
- React Helmet：https://github.com/nfl/react-helmet
- Lighthouse 性能检测：https://developer.chrome.com/docs/lighthouse/overview/
- Core Web Vitals：https://web.dev/vitals/

### 17.5 物流追踪开发
- 17track API：https://www.17track.net/en/api
- AfterShip API：https://www.aftership.com/docs/api/4
- Shopify Fulfillment API：https://shopify.dev/docs/api/admin-rest/2024-07/resources/fulfillment

---

## 十八、下一步行动

1. **确认 Phase 5 成果**：用户审核并确认 Phase 5 完成情况
2. **开始 Phase 6 开发**：进行 SEO 优化、性能优化、预渲染配置
3. **Phase 6 具体任务**：
   - Meta 标签管理组件开发
   - Sitemap 和 robots.txt 配置
   - 结构化数据（Schema.org）实现
   - 关键页面预渲染配置
   - 多语言 SEO（hreflang）配置
   - 性能优化（LCP、FID、CLS）
4. **开始 Phase 7 开发**：物流追踪模块开发
5. **Phase 7 具体任务**：
   - 物流类型定义
   - Fulfillment API 集成
   - 物流服务层封装
   - 物流追踪页面开发
   - 多物流商适配层设计
6. **编写测试用例**：补充单元测试和 E2E 测试
7. **生产环境部署**：配置生产环境，进行上线前验证
8. **项目上线**：正式部署到生产环境

---

## 十九、文档变更记录

| 版本 | 日期 | 变更内容 | 变更人 |
|------|------|----------|--------|
| v1.0 | 2026-05-31 | 初始版本，完整项目计划 | AI 开发助手 |
| v2.0 | 2026-06-04 | 更新 Phase 5 完成情况，补充 Checkout 模块设计，更新技术栈版本 | AI 开发助手 |
| v3.0 | 2026-06-04 | 新增 Phase 6（SEO 优化）和 Phase 7（物流追踪）详细规划，补充物流追踪模块设计（10.1-10.8）和 SEO 优化设计（11.1-11.12），更新技术选型、风险评估、关键技术难点和学习资源 | AI 开发助手 |

---

**文档版本**: v3.0  
**创建日期**: 2026-05-31  
**最后更新**: 2026-06-04
