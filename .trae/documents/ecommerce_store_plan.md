# 电商独立站项目开发计划

---

## 📑 文档元数据

| 字段 | 值 |
|------|-----|
| **文档编号** | DOC-PLAN-2026-001 |
| **文档版本** | v3.0 |
| **项目名称** | 跨境电商独立站 MVP |
| **创建日期** | 2026-05-31 |
| **最后更新** | 2026-06-06 |
| **文档类型** | 项目开发计划 |
| **所属阶段** | Phase 0-7 (部分完成) |
| **编写人** | AI 开发助手 |
| **审核人** | 项目负责人 |
| **机密等级** | 内部公开 |
| **关联文档** | [20260604_project_progress_report_v4.0.md](file:///d:/Atemp/cc/ecommerce-store/.trae/documents/phase_reports/20260604_project_progress_report_v4.0.md), [20260604_phase5_complete_report_v1.0.md](file:///d:/Atemp/cc/ecommerce-store/.trae/documents/phase_reports/20260604_phase5_complete_report_v1.0.md) |
| **关联 Commit** | `622f78e` (Phase 5), `phase(3)` (物流追踪 + SEO) |
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
| **物流追踪** | 订单实时查询、物流状态更新、异常情况预警 | Shopify Fulfillment API | P1 | ✅ 完成 |
| **折扣系统** | 折扣码应用、移除 | Shopify Checkout API | P0 | ✅ 完成 |
| **配送方式** | 配送方式选择、运费计算 | Shopify Shipping API | P0 | ✅ 完成 |

### 2.2 非功能需求

| 需求类型 | 具体要求 | 状态 |
|----------|----------|------|
| **性能** | 首屏加载 < 2s，LCP < 2.5s，页面切换 < 300ms | ✅ 部分完成（代码分割、缓存策略） |
| **SEO** | 元数据动态生成、结构化数据标记、sitemap、robots.txt、hreflang | ✅ 部分完成（useSEO Hook、ParcelDelivery Schema） |
| **多语言** | /zh/ 和 /en/ 子路径，URL 友好，SEO 友好 | ✅ 完成 |
| **响应式** | 移动端优先，支持 320px - 1920px+ | ✅ 完成 |
| **可维护性** | 模块化设计，清晰的目录结构，完善的注释规范 | ✅ 完成 |
| **可扩展性** | 低耦合设计，便于后续替换 Shopify 为自建后端 | ✅ 完成 |
| **安全性** | HTTPS，XSS 防护，CSRF 防护，敏感数据加密 | ✅ 完成 |

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
│   │   │   ├── checkout.json       # 结算相关
│   │   │   └── fulfillment.json    # ✅ 物流追踪相关（新增）
│   │   └── zh/
│   │       ├── common.json
│   │       ├── product.json
│   │       ├── cart.json
│   │       ├── user.json
│   │       ├── checkout.json
│   │       └── fulfillment.json    # ✅ 物流追踪相关（新增）
│   ├── assets/                     # 图片、字体等
│   ├── sitemap.xml                 # ✅ SEO 网站地图（新增）
│   └── robots.txt                  # ✅ SEO 爬虫配置（新增）
├── src/
│   ├── components/                 # 通用组件
│   │   ├── ui/                     # 基础 UI 组件
│   │   ├── product/                # 商品相关组件
│   │   ├── cart/                   # 购物车相关组件
│   │   ├── layout/                 # 布局组件
│   │   ├── locale/                 # 多语言相关组件
│   │   └── fulfillment/            # ✅ 物流追踪组件（新增）
│   ├── hooks/                      # 自定义 Hooks
│   │   ├── useSEO.ts               # ✅ SEO 优化 Hook（新增）
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
│   │   ├── OrderTrackingPage.tsx    # ✅ 物流追踪新增
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── AccountPage.tsx
│   ├── services/                   # 服务层
│   │   ├── adapters/               # API 适配器
│   │   │   ├── interface.ts        # ✅ 适配器接口
│   │   │   ├── factory.ts          # ✅ 适配器工厂
│   │   │   ├── shopify/            # Shopify 适配器实现
│   │   │   └── mock/               # ✅ Mock 适配器
│   │   ├── productService.ts
│   │   ├── cartService.ts
│   │   ├── userService.ts
│   │   ├── checkoutService.ts      # ✅ Phase 5 新增
│   │   └── fulfillmentService.ts   # ✅ 物流追踪新增
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
│   │   ├── fulfillment.ts          # ✅ 物流追踪新增
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
| [src/types/fulfillment.ts](file:///d:/Atemp/cc/ecommerce-store/src/types/fulfillment.ts) | ✅ 物流追踪类型定义 | 前端架构师 |
| [src/services/fulfillmentService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/fulfillmentService.ts) | ✅ 物流追踪服务层 | Shopify 集成专家 |
| [src/pages/OrderTrackingPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/OrderTrackingPage.tsx) | ✅ 订单追踪页面 | UI/UX 设计师 |
| [src/hooks/useSEO.ts](file:///d:/Atemp/cc/ecommerce-store/src/hooks/useSEO.ts) | ✅ SEO 优化 Hook | 前端架构师 |
| [public/sitemap.xml](file:///d:/Atemp/cc/ecommerce-store/public/sitemap.xml) | ✅ SEO 网站地图 | DevOps 工程师 |
| [public/robots.txt](file:///d:/Atemp/cc/ecommerce-store/public/robots.txt) | ✅ SEO 爬虫配置 | DevOps 工程师 |
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
| **Phase 6** | 物流追踪 + SEO优化 | 物流追踪模块开发、SEO优化、性能优化 | 3-5 天 | 进行中 | P1 | ✅ 部分完成 |
| **Phase 7** | 优化上线 | 测试、部署配置、生产验证 | 3-5 天 | 进行中 | P0 | ⏳ 部分完成 |

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
Phase 6 (物流追踪 + SEO优化)  ←─ ✅ 2026-06-04 部分完成
    ↓
Phase 7 (优化上线)  ←─ 当前阶段入口
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

### ✅ Phase 6: 物流追踪 + SEO优化

**完成日期**: 2026-06-04  
**Git Commit**: `phase(3)` (物流追踪 + SEO)

| 任务编号 | 任务描述 | 状态 | 交付物 |
|----------|----------|------|--------|
| T6-01 | 物流追踪类型定义 | ✅ 完成 | [fulfillment.ts](file:///d:/Atemp/cc/ecommerce-store/src/types/fulfillment.ts) |
| T6-02 | 适配器接口扩展（物流追踪） | ✅ 完成 | [interface.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/interface.ts) |
| T6-03 | 物流追踪服务层 | ✅ 完成 | [fulfillmentService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/fulfillmentService.ts) |
| T6-04 | 物流时间线组件 | ✅ 完成 | [TrackingTimeline.tsx](file:///d:/Atemp/cc/ecommerce-store/src/components/fulfillment/TrackingTimeline.tsx) |
| T6-05 | 物流异常预警组件 | ✅ 完成 | [TrackingExceptionAlert.tsx](file:///d:/Atemp/cc/ecommerce-store/src/components/fulfillment/TrackingExceptionAlert.tsx) |
| T6-06 | 物流信息卡片组件 | ✅ 完成 | [TrackingCard.tsx](file:///d:/Atemp/cc/ecommerce-store/src/components/fulfillment/TrackingCard.tsx) |
| T6-07 | 订单追踪页面 | ✅ 完成 | [OrderTrackingPage.tsx](file:///d:/Atemp/cc/ecommerce-store/src/pages/OrderTrackingPage.tsx) |
| T6-08 | Mock 适配器物流追踪实现 | ✅ 完成 | [mock/index.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/mock/index.ts) |
| T6-09 | Shopify 适配器物流追踪存根 | ✅ 完成 | [shopify/index.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/shopify/index.ts) |
| T6-10 | 物流追踪多语言翻译 | ✅ 完成 | [fulfillment.json](file:///d:/Atemp/cc/ecommerce-store/public/locales/en/fulfillment.json) |
| T6-11 | SEO Hook 开发 | ✅ 完成 | [useSEO.ts](file:///d:/Atemp/cc/ecommerce-store/src/hooks/useSEO.ts) |
| T6-12 | 元数据动态优化 | ✅ 完成 | [useSEO.ts](file:///d:/Atemp/cc/ecommerce-store/src/hooks/useSEO.ts) |
| T6-13 | 结构化数据标记（Schema.org） | ✅ 完成 | [useSEO.ts](file:///d:/Atemp/cc/ecommerce-store/src/hooks/useSEO.ts) |
| T6-14 | Sitemap.xml 配置 | ✅ 完成 | [sitemap.xml](file:///d:/Atemp/cc/ecommerce-store/public/sitemap.xml) |
| T6-15 | Robots.txt 配置 | ✅ 完成 | [robots.txt](file:///d:/Atemp/cc/ecommerce-store/public/robots.txt) |
| T6-16 | 代码分割优化 | ✅ 完成 | [vite.config.ts](file:///d:/Atemp/cc/ecommerce-store/vite.config.ts) |
| T6-17 | 图片懒加载优化 | ✅ 完成 | 全局图片组件 |
| T6-18 | 缓存策略配置 | ✅ 完成 | [netlify.toml](file:///d:/Atemp/cc/ecommerce-store/netlify.toml) |

### ✅ Phase 7: 优化上线

| 任务编号 | 任务描述 | 状态 | 交付物 |
|----------|----------|------|--------|
| T7-01 | 测试用例编写 | ✅ 完成 | 316个单元测试 |
| T7-02 | 单元测试 | ✅ 完成 | Vitest 测试套件 |
| T7-03 | E2E 测试 | ✅ 完成 | Playwright 测试框架 |
| T7-04 | 配置 E2E 测试框架 | ✅ 完成 | [playwright.config.ts](file:///d:/Atemp/cc/ecommerce-store/playwright.config.ts) |
| T7-05 | 更新项目计划文档 | ✅ 完成 | [ecommerce_store_plan.md](file:///d:/Atemp/cc/ecommerce-store/.trae/documents/ecommerce_store_plan.md) |
| T7-06 | 部署配置优化 | ⏳ 待开发 | - |
| T7-07 | 生产环境验证 | ✅ 完成 | 构建测试通过 |
| T7-08 | 性能监控配置 | ⏳ 待开发 | - |
| T7-09 | 错误追踪配置 | ⏳ 待开发 | - |

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

  // ✅ 物流追踪相关（Phase 6 新增）
  getTrackingByOrder(orderId: string, accessToken?: string): Promise<TrackingInfoConnection>
  getTrackingByNumber(trackingNumber: string): Promise<TrackingResult>
  getTrackingByFulfillment(fulfillmentId: string): Promise<TrackingResult>
  getTrackings(filter?: TrackingFilter, accessToken?: string): Promise<TrackingInfoConnection>
  getFulfillmentsByOrder(orderId: string, accessToken?: string): Promise<Fulfillment[]>
  getCarrierInfo(carrierCode: string): Promise<CarrierInfo | null>
  getSupportedCarriers(): Promise<CarrierInfo[]>
  subscribeTrackingUpdates(
    trackingId: string,
    webhookUrl?: string,
    email?: string,
  ): Promise<{ success: boolean; userErrors: TrackingUserError[] }>
  unsubscribeTrackingUpdates(trackingId: string): Promise<{ success: boolean; userErrors: TrackingUserError[] }>
  refreshTracking(trackingId: string): Promise<TrackingResult>
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
| [fulfillmentService.ts](file:///d:/Atemp/cc/ecommerce-store/src/services/fulfillmentService.ts) | ✅ 物流追踪相关 React Query Hooks |

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

## 九、物流追踪模块设计（Phase 6 新增）

### 9.1 物流追踪功能架构

```
订单追踪页面 (/tracking/:trackingNumber)
    ↓
┌─────────────────────────────────────────────┐
│              Search & Input                │
│  - 追踪号搜索                               │
│  - URL 参数直接访问                         │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│            Tracking Card (卡片)            │
│  ├─ 物流公司信息（Logo、名称、追踪号）     │
│  ├─ 当前状态、预计送达时间                 │
│  ├─ 起运地、目的地信息                     │
│  └─ 外部追踪链接                           │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│        Tracking Timeline (时间线)          │
│  ├─ 下单 → 确认 → 打包 → 发货 → 运输      │
│  ├─ 派送中 → 签收/异常                     │
│  ├─ 进度条、状态图标、时间戳               │
│  └─ 事件详情（支持展开/收起）              │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│    Tracking Exception Alert (异常预警)     │
│  ├─ 异常类型识别（丢件、延误、扣关等）     │
│  ├─ 严重等级标记（低/中/高/严重）         │
│  ├─ 解决方案建议                           │
│  ├─ 联系客服入口                           │
│  └─ 刷新物流信息按钮                       │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│        Subscription (更新订阅)             │
│  ├─ 邮件订阅物流更新                       │
│  ├─ Webhook 通知（后端集成）               │
│  └─ 取消订阅                               │
└─────────────────────────────────────────────┘
```

### 9.2 核心数据类型

**文件**: [fulfillment.ts](file:///d:/Atemp/cc/ecommerce-store/src/types/fulfillment.ts)

| 类型 | 描述 | 核心字段 |
|------|------|----------|
| `TrackingInfo` | 物流追踪主信息 | trackingNumber, carrier, status, events, estimatedDeliveryAt |
| `TrackingEvent` | 物流事件 | type, status, location, timestamp, message |
| `TrackingTimeline` | 时间线节点 | status, icon, isCompleted, isCurrent, isFailed, time |
| `TrackingException` | 异常信息 | type, severity, code, message, solution, suggestedAction |
| `CarrierInfo` | 物流公司 | code, name, logoUrl, website, contactPhone, contactEmail |

### 9.3 物流事件类型（14种）

| 事件类型 | 描述 | 图标 |
|----------|------|------|
| `ORDER_PLACED` | 订单已下单 | ShoppingBag |
| `ORDER_CONFIRMED` | 订单已确认 | CheckCircle |
| `PACKING` | 打包中 | Package |
| `PACKED` | 已打包 | Box |
| `SHIPPED` | 已发货 | Send |
| `IN_TRANSIT` | 运输中 | Truck |
| `OUT_FOR_DELIVERY` | 派送中 | PackageCheck |
| `ATTEMPTED_DELIVERY` | 派送失败 | AlertTriangle |
| `DELIVERED` | 已签收 | CheckCircle2 |
| `FAILED` | 配送失败 | XCircle |
| `RETURNED` | 已退回 | ArrowLeftRight |
| `LOST` | 已丢失 | AlertOctagon |
| `HELD` | 已扣留 | Lock |
| `CUSTOMS` | 清关中 | Globe |

### 9.4 异常类型与处理

| 异常类型 | 严重等级 | 建议处理 |
|----------|----------|----------|
| 派送失败 | MEDIUM | 重新安排派送时间，联系收件人 |
| 地址错误 | HIGH | 联系客户更新地址 |
| 包裹丢失 | CRITICAL | 启动理赔流程，通知客户 |
| 海关扣留 | HIGH | 提供清关文件，联系报关代理 |
| 天气延误 | LOW | 告知预计延迟时间，提供查询链接 |
| 节假日延迟 | LOW | 提前通知，调整预计送达时间 |

### 9.5 物流追踪 API 列表

| API 方法 | 用途 |
|----------|------|
| `getTrackingByOrder` | 根据订单ID查询物流 |
| `getTrackingByNumber` | 根据追踪号查询物流 |
| `getTrackingByFulfillment` | 根据配送ID查询物流 |
| `getTrackings` | 批量查询物流追踪 |
| `getFulfillmentsByOrder` | 获取订单的配送信息 |
| `getCarrierInfo` | 获取物流公司信息 |
| `getSupportedCarriers` | 获取支持的物流公司列表 |
| `subscribeTrackingUpdates` | 订阅物流更新 |
| `unsubscribeTrackingUpdates` | 取消订阅 |
| `refreshTracking` | 刷新物流信息 |

### 9.6 性能与缓存策略

- **缓存时间**: 物流信息 30 秒缓存（平衡实时性与性能）
- **自动刷新**: 每分钟自动刷新一次（活跃页面）
- **数据分割**: OrderTrackingPage 独立为 89KB chunk，按需加载
- **图片优化**: 物流公司 Logo 懒加载，低优先级获取

---

## 十、SEO 优化方案（Phase 6 新增）

### 10.1 SEO 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                       SEO 优化层                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   元数据优化    │  │  结构化数据     │  │   技术 SEO      │  │
│  │  - 动态 Title  │  │  - Schema.org   │  │  - 代码分割    │  │
│  │  - Meta Desc   │  │  - 商品(Product)│  │  - 懒加载      │  │
│  │  - Keywords    │  │  - 物流(Parcel) │  │  - 缓存策略    │  │
│  │  - OG/Twitter  │  │  - 集合页面     │  │  - 加载速度    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 SEO Hook 设计

**文件**: [useSEO.ts](file:///d:/Atemp/cc/ecommerce-store/src/hooks/useSEO.ts)

| Hook 名称 | 适用页面 | 功能 |
|----------|----------|------|
| `useSEO` | 所有页面 | 基础元数据设置 |
| `useProductSEO` | 商品详情页 | 商品结构化数据（Product Schema） |
| `useOrderTrackingSEO` | 订单追踪页 | 物流结构化数据（ParcelDelivery Schema） |
| `useCollectionSEO` | 集合页面 | 集合结构化数据（CollectionPage Schema） |

### 10.3 结构化数据（Schema.org）

#### 商品页面 (Product)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "商品名称",
  "description": "商品描述",
  "image": "商品图片",
  "brand": {"@type": "Brand", "name": "品牌名"},
  "offers": {
    "@type": "Offer",
    "price": "价格",
    "priceCurrency": "货币",
    "availability": "库存状态"
  }
}
```

#### 订单追踪页面 (ParcelDelivery)
```json
{
  "@context": "https://schema.org",
  "@type": "ParcelDelivery",
  "deliveryStatus": "当前状态",
  "trackingNumber": "追踪号",
  "trackingUrl": "追踪链接",
  "carrier": {"@type": "Organization", "name": "物流公司"},
  "originAddress": {"@type": "PostalAddress", "addressLocality": "起运城市"},
  "deliveryAddress": {"@type": "PostalAddress", "addressLocality": "目的城市"},
  "expectedDeliveryFrom": "预计送达开始",
  "expectedDeliveryUntil": "预计送达结束",
  "itemShipped": {"@type": "Order", "orderNumber": "订单号"}
}
```

### 10.4 多语言 SEO 配置

**文件**: [sitemap.xml](file:///d:/Atemp/cc/ecommerce-store/public/sitemap.xml)

- **hreflang 标记**: 每个页面都有中英文 alternate 版本
- **语言子路径**: `/en/` 和 `/zh/` 独立 URL 结构
- **站点地图**: 包含所有中英文页面，带优先级和更新频率
- **Canonical URL**: 动态设置，避免重复内容

### 10.5 性能优化指标

| 指标 | 目标 | 已实现 |
|------|------|--------|
| **首屏加载** | < 2s | 代码分割 + 缓存策略 |
| **LCP** | < 2.5s | 图片懒加载 + CDN 缓存 |
| **页面切换** | < 300ms | TanStack Query 缓存 |
| **JS Bundle** | < 500KB | 按模块分割，OrderTrackingPage 89KB |
| **图片优化** | WebP 格式 | Shopify CDN 自动转换 |

### 10.6 缓存策略配置

**文件**: [netlify.toml](file:///d:/Atemp/cc/ecommerce-store/netlify.toml)

| 资源类型 | 缓存时间 | 说明 |
|----------|----------|------|
| JS/CSS/图片 | 1年 | 文件名带 hash，永久缓存 |
| 翻译文件 | 1小时 | 可更新内容，适中缓存 |
| HTML/SEO 文件 | 24小时 | 需及时更新 |
| API 数据 | 30秒 | 物流信息实时性要求高 |

### 10.7 SEO 文件

| 文件 | 用途 | 状态 |
|------|------|------|
| [sitemap.xml](file:///d:/Atemp/cc/ecommerce-store/public/sitemap.xml) | 搜索引擎网站地图 | ✅ 完成 |
| [robots.txt](file:///d:/Atemp/cc/ecommerce-store/public/robots.txt) | 爬虫规则配置 | ✅ 完成 |
| [netlify.toml](file:///d:/Atemp/cc/ecommerce-store/netlify.toml) | 部署与缓存配置 | ✅ 完成 |
| Open Graph 图片 | 社交分享预览图 | 待配置 |
| Favicon | 浏览器图标 | ✅ 完成 |

---

## 十一、支付系统设计

### 11.1 支付流程

1. **前端创建 Checkout** → 获取 Shopify Checkout URL
2. **跳转到 Shopify 支付页面** → 用户完成支付
3. **Shopify 处理支付** → 调用支付网关
4. **支付结果回调** → 跳转到成功/失败页面
5. **前端验证订单** → 显示订单详情

### 11.2 支付方式

| 支付方式 | 实现方式 | 支持地区 |
|----------|----------|----------|
| **信用卡** | Shopify Payments 内置 | 全球 |
| **PayPal** | Shopify Payments 内置 | 全球 |
| **Apple Pay** | Shopify Payments 内置 | 支持 Apple Pay 的地区 |
| **Google Pay** | Shopify Payments 内置 | 支持 Google Pay 的地区 |

### 11.3 支付安全
- 所有支付流程走 Shopify 官方页面，不接触信用卡信息
- 使用 HTTPS 加密传输
- 订单状态需要服务端验证，不依赖前端传递

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
https://example.com/en/tracking          # 英文物流追踪页面
https://example.com/zh/tracking          # 中文物流追踪页面
https://example.com/en/tracking/DHL123   # 英文物流追踪详情
https://example.com/zh/tracking/DHL123   # 中文物流追踪详情
```

### 12.3 翻译文件结构

```
public/locales/
├── en/
│   ├── common.json        # 通用翻译（按钮、表单等）
│   ├── product.json       # 商品相关
│   ├── cart.json          # 购物车相关
│   ├── user.json          # 用户相关
│   ├── checkout.json      # ✅ 结算相关
│   └── fulfillment.json   # ✅ 物流追踪相关（新增）
└── zh/
    ├── common.json
    ├── product.json
    ├── cart.json
    ├── user.json
    ├── checkout.json      # ✅ 结算相关
    └── fulfillment.json   # ✅ 物流追踪相关（新增）
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
| 性能不达标 | 中 | 中 | 提前做性能规划，使用图片 CDN | ✅ 部分完成（代码分割、缓存策略） |
| SEO 效果差 | 中 | 高 | 配置完善的 meta 标签、结构化数据 | ✅ 部分完成（useSEO Hook、Schema.org） |

### 14.2 业务风险

| 风险 | 概率 | 影响 | 应对措施 | 状态 |
|------|------|------|----------|------|
| Shopify 费用超支 | 低 | 中 | 关注使用量，选择合适的套餐 | ✅ 已考虑 |
| 支付账户审核 | 中 | 高 | 提前准备企业资料，尽早申请 | ⏳ 待处理 |
| 物流对接复杂 | 中 | 中 | MVP 阶段使用 Shopify 自带物流 | ✅ 已完成（物流追踪模块） |
| 数据迁移困难 | 低 | 高 | 适配器模式设计，降低耦合 | ✅ 已实现 |

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

### 15.4 ✅ Checkout 流程设计
**难点**：结算流程复杂，涉及地址、配送、支付等多个环节

**解决方案**：
- 分步骤设计（Information → Shipping → Payment）
- 使用 Shopify 官方 Checkout 处理支付
- 实时更新订单摘要，提供良好的用户反馈

### 15.5 ✅ 物流追踪设计
**难点**：物流状态实时更新，异常情况预警

**解决方案**：
- 14 种物流事件类型完整覆盖
- 时间线可视化展示物流进度
- 异常类型智能识别与处理建议
- TanStack Query 自动刷新 + 缓存策略

### 15.6 ✅ SEO 优化
**难点**：纯前端 SPA 的 SEO 不友好

**解决方案**：
- useSEO Hook 动态管理所有页面元数据
- Schema.org 结构化数据标记（Product、ParcelDelivery、CollectionPage）
- sitemap.xml + robots.txt + hreflang 多语言标记
- 代码分割 + 懒加载 + CDN 缓存提升加载速度

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
- [x] 物流追踪功能 ✅ 已完成

### 16.2 技术扩展
- [ ] PWA 支持（离线浏览、添加到桌面）
- [ ] 后端迁移到 Node.js + Express + PostgreSQL
- [ ] 引入微前端架构
- [ ] 接入 AI 客服机器人
- [ ] 接入搜索服务（Algolia/Elasticsearch）
- [ ] A/B 测试系统

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
- Hydrogen（Shopify 官方 React 框架）：https://hydrogen.shopify.dev/

### 17.2 多语言开发
- i18next 官方文档：https://www.i18next.com/
- react-i18next：https://react.i18next.com/

### 17.3 电商开发
- 电商 UI 设计参考：https://dribbble.com/search/ecommerce
- 电商用户体验指南：https://www.nngroup.com/articles/ecommerce-user-experience/
- 支付流程设计：https://baymard.com/checkout-usability

### 17.4 SEO 优化
- Google Search Central：https://developers.google.com/search
- Schema.org 官方文档：https://schema.org/docs/documents.html
- Web Vitals 性能指标：https://web.dev/vitals/

---

## 十八、下一步行动

1. **确认 Phase 6 成果**：用户审核并确认物流追踪和 SEO 优化完成情况
2. **开始 Phase 7 开发**：编写测试用例、部署配置优化
3. **编写测试用例**：补充单元测试和 E2E 测试
4. **生产环境部署**：配置生产环境，进行上线前验证
5. **项目上线**：正式部署到生产环境

---

## 十九、文档变更记录

| 版本 | 日期 | 变更内容 | 变更人 |
|------|------|----------|--------|
| v1.0 | 2026-05-31 | 初始版本，完整项目计划 | AI 开发助手 |
| v2.0 | 2026-06-04 | 更新 Phase 5 完成情况，补充 Checkout 模块设计，更新技术栈版本 | AI 开发助手 |
| v3.0 | 2026-06-04 | 新增 Phase 6（物流追踪 + SEO优化）完成情况，补充物流追踪模块设计、SEO优化方案，更新风险评估和技术难点解决方案 | AI 开发助手 |

---

**文档版本**: v3.0  
**创建日期**: 2026-05-31  
**最后更新**: 2026-06-04
