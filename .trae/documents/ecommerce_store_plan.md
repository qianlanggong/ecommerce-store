# 电商独立站项目计划

## 一、项目概述

### 1.1 项目定位
- **项目名称**：跨境电商独立站（暂定名）
- **项目目标**：搭建一个 MVP 版本的跨境电商独立站，支持多语言，快速上线，后续迭代优化
- **核心价值**：
  - 学习 Shopify 无头电商开发，提升技术栈深度
  - 积累完整电商项目经验，为简历/面试加分
  - 建立规范化的项目结构，便于 AI 辅助开发
  - 为未来业务扩展预留架构空间

### 1.2 项目背景
- **开发团队**：单人开发（前端背景）
- **技术基础**：HTML/CSS/JS、jQuery、Vue、React、Node.js 基础
- **时间规划**：MVP 快速上线，持续迭代

---

## 二、需求分析

### 2.1 核心功能（MVP 版本）

| 模块 | 功能描述 | 实现方式 | 优先级 |
|------|----------|----------|--------|
| **商品展示** | 首页、商品列表、商品详情、商品分类 | 前端 + Shopify Storefront API | P0 |
| **用户系统** | 注册、登录、个人中心 | Shopify Customer API | P0 |
| **购物车** | 添加、删除、修改数量、结算 | Shopify Cart API | P0 |
| **收藏管理** | 商品收藏、收藏列表 | 前端 localStorage + 后续自建后端 | P1 |
| **地址管理** | 收货地址增删改查 | Shopify Customer API | P0 |
| **订单管理** | 订单列表、订单详情、订单状态 | Shopify Order API | P0 |
| **支付系统** | 结算、支付、支付回调 | Shopify Checkout API | P0 |
| **多语言系统** | 中英文切换、UI 翻译 | i18next + 子路径路由 | P0 |
| **物流追踪** | 物流信息展示 | Shopify Fulfillment API | P1 |

### 2.2 非功能需求

| 需求类型 | 具体要求 |
|----------|----------|
| **性能** | 首屏加载 < 2s，LCP < 2.5s，页面切换 < 300ms |
| **SEO** | 支持 SSR/SSG，meta 标签动态生成，sitemap，robots.txt |
| **多语言** | /zh/ 和 /en/ 子路径，URL 友好，SEO 友好 |
| **响应式** | 移动端优先，支持 320px - 1920px+ |
| **可维护性** | 模块化设计，清晰的目录结构，完善的注释规范 |
| **可扩展性** | 低耦合设计，便于后续替换 Shopify 为自建后端 |
| **安全性** | HTTPS，XSS 防护，CSRF 防护，敏感数据加密 |

---

## 三、技术架构

### 3.1 技术选型

| 层级 | 技术选型 | 选择理由 |
|------|----------|----------|
| **前端框架** | React 18 + TypeScript | 生态成熟，学习资源多，就业市场需求大 |
| **构建工具** | Vite 5 | 开发体验好，热更新快，构建速度快 |
| **样式方案** | Tailwind CSS 4 | 原子化 CSS，开发效率高，便于统一设计系统 |
| **状态管理** | Zustand | 轻量级，API 简洁，适合中小型项目 |
| **路由方案** | React Router v6 | 支持嵌套路由、动态路由，配合子路径多语言 |
| **多语言方案** | i18next + react-i18next | 功能完善，支持插值、复数、日期格式化 |
| **数据请求** | TanStack Query (React Query) | 缓存、重发、乐观更新，提升用户体验 |
| **电商后端** | Shopify（无头模式） | 成熟的电商系统，减少后端开发量，学习价值高 |
| **UI 组件库** | shadcn/ui + Radix UI | 可定制性强，无障碍友好，不臃肿 |
| **图标库** | Lucide React | 现代、简洁、统一的图标风格 |
| **部署平台** | Vercel | 支持 Next.js 风格的 rewrite，一键部署，CDN 全球加速 |
| **代码规范** | ESLint + Prettier + Husky + lint-staged | 保证代码质量，统一代码风格 |
| **AI 辅助** | claude.md + Skills | 规范化项目结构，提升 AI 生成代码质量 |

### 3.2 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                        客户端                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  浏览器  │  │  移动端  │  │   PWA    │  │  其他    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                       前端应用层                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  React 应用（多语言路由、状态管理、UI 组件）        │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  API 适配层（统一接口封装，屏蔽后端差异）          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                    电商后端服务层                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Shopify 平台（当前）                  │  │
│  │  - Storefront API（商品、购物车、结账）            │  │
│  │  - Admin API（订单、库存管理）                     │  │
│  │  - Customer API（用户、地址管理）                 │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │              自建后端（未来扩展）                  │  │
│  │  - Node.js + Express + PostgreSQL                 │  │
│  │  - 可无缝替换 Shopify                              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                    第三方服务集成                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 支付网关 │  │  物流    │  │  邮件    │  │  分析    │ │
│  │ Stripe   │  │  服务商  │  │  服务    │  │  GA4     │ │
│  │ PayPal   │  │          │  │          │  │  等      │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 3.3 架构关键设计决策

1. **API 适配层模式**
   - 所有对 Shopify 的调用通过统一的 API 适配层
   - 适配层定义标准接口，后续替换后端时只需修改适配层实现
   - 降低前端与具体后端的耦合

2. **多语言子路径实现**
   - 使用 Vercel rewrite 配置实现 /zh/ 和 /en/ 子路径
   - React Router 动态读取语言前缀
   - 避免使用哈希或查询参数，保证 SEO 友好

3. **Shopify 无头模式**
   - 前端完全自主控制，不使用 Shopify 主题
   - 通过 Storefront API 获取公开数据
   - 敏感操作（支付、订单）通过 Shopify Checkout 处理

4. **渐进式重构策略**
   - 第一阶段：100% 使用 Shopify 能力
   - 第二阶段：逐步将用户、收藏等非核心功能迁移到自建后端
   - 第三阶段：完全替换 Shopify，自主可控

---

## 四、项目目录结构

### 4.1 整体结构

```
ecommerce-store/
├── .trae/                          # AI 辅助开发配置
│   ├── documents/                  # 项目文档
│   │   ├── ecommerce_store_plan.md # 本计划文档
│   │   ├── prd.md                  # 产品需求文档
│   │   └── tech_arch.md            # 技术架构文档
│   └── skills/                     # 自定义技能
├── public/                         # 静态资源
│   ├── locales/                    # 多语言翻译文件
│   │   ├── en/
│   │   └── zh/
│   └── assets/                     # 图片、字体等
├── src/
│   ├── app/                        # 应用入口和路由
│   │   ├── [locale]/               # 多语言动态路由
│   │   │   ├── page.tsx            # 首页
│   │   │   ├── products/           # 商品相关页面
│   │   │   ├── cart/               # 购物车页面
│   │   │   ├── account/            # 用户中心页面
│   │   │   └── checkout/           # 结算页面
│   │   └── layout.tsx              # 根布局
│   ├── components/                 # 可复用组件
│   │   ├── ui/                     # 基础 UI 组件（shadcn）
│   │   ├── product/                # 商品相关组件
│   │   ├── cart/                   # 购物车相关组件
│   │   ├── layout/                 # 布局组件
│   │   └── locale/                 # 多语言相关组件
│   ├── hooks/                      # 自定义 Hooks
│   │   ├── useCart.ts              # 购物车逻辑
│   │   ├── useProducts.ts          # 商品数据逻辑
│   │   ├── useUser.ts              # 用户逻辑
│   │   └── useLocale.ts            # 多语言逻辑
│   ├── stores/                     # 状态管理（Zustand）
│   │   ├── cartStore.ts
│   │   ├── userStore.ts
│   │   └── localeStore.ts
│   ├── services/                   # API 服务层
│   │   ├── api/                    # 统一 API 客户端
│   │   │   ├── client.ts           # 请求封装
│   │   │   └── types.ts            # 类型定义
│   │   ├── adapters/               # 后端适配层
│   │   │   ├── shopify/            # Shopify 适配器
│   │   │   │   ├── productAdapter.ts
│   │   │   │   ├── cartAdapter.ts
│   │   │   │   ├── userAdapter.ts
│   │   │   │   └── index.ts
│   │   │   └── interface.ts        # 适配器接口定义
│   │   ├── productService.ts       # 商品服务（面向前端）
│   │   ├── cartService.ts          # 购物车服务
│   │   └── userService.ts          # 用户服务
│   ├── lib/                        # 工具库
│   │   ├── i18n/                   # 多语言配置
│   │   ├── shopify/                # Shopify 配置
│   │   ├── utils.ts                # 通用工具函数
│   │   └── constants.ts            # 常量定义
│   ├── types/                      # TypeScript 类型定义
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── user.ts
│   │   └── index.ts
│   ├── styles/                     # 全局样式
│   │   └── globals.css
│   └── middleware.ts               # Vercel 中间件（处理多语言路由）
├── api/                            # 后端 API（未来扩展）
│   └── index.ts
├── .github/                        # GitHub 配置
│   └── workflows/                  # CI/CD 工作流
├── .husky/                         # Git Hooks 配置
├── .vscode/                        # VSCode 配置
├── vercel.json                     # Vercel 部署配置
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── prettier.config.js
├── .env.example
├── .env.local
├── .gitignore
├── CLAUDE.md                       # AI 辅助开发规范
└── README.md
```

### 4.2 关键目录说明

- **`src/services/adapters/`**：核心解耦层，定义标准接口，封装 Shopify 具体实现
- **`src/app/[locale]/`**：基于 Next.js App Router 风格的多语言路由，通过 Vercel 中间件实现
- **`src/hooks/`**：业务逻辑 Hooks，组件只负责渲染，逻辑在 Hooks 中
- **`.trae/`**：AI 辅助开发配置目录，包含项目文档和自定义技能
- **`CLAUDE.md`**：AI 代码生成规范，确保生成的代码符合项目标准

---

## 五、开发计划

### 5.1 开发阶段划分

| 阶段 | 名称 | 主要内容 | 预计时间 | 交付物 |
|------|------|----------|----------|--------|
| **Phase 0** | 项目初始化 | 目录结构、配置文件、规范文档 | 1-2 天 | 可运行的空项目框架 |
| **Phase 1** | 基础架构 | 多语言系统、路由、状态管理、API 适配层 | 3-5 天 | 多语言切换、路由跳转正常 |
| **Phase 2** | 商品模块 | 商品列表、商品详情、分类筛选 | 5-7 天 | 完整的商品浏览功能 |
| **Phase 3** | 购物车模块 | 添加购物车、购物车列表、数量修改 | 3-4 天 | 购物车功能完整 |
| **Phase 4** | 用户模块 | 注册登录、个人中心、地址管理 | 5-7 天 | 用户系统完整 |
| **Phase 5** | 订单支付 | 结算流程、支付集成、订单管理 | 5-7 天 | 完整的购买流程 |
| **Phase 6** | 优化上线 | SEO、性能优化、部署配置、测试 | 3-5 天 | 可上线的 MVP 版本 |

### 5.2 各阶段详细任务

#### Phase 0: 项目初始化
- [ ] 创建项目目录结构
- [ ] 初始化 Vite + React + TypeScript 项目
- [ ] 配置 Tailwind CSS 4
- [ ] 配置 ESLint + Prettier
- [ ] 配置 Husky + lint-staged
- [ ] 配置 shadcn/ui 组件库
- [ ] 编写 CLAUDE.md 规范文档
- [ ] 配置 .env 环境变量模板
- [ ] 配置 Vercel 部署配置
- [ ] 编写项目 README

#### Phase 1: 基础架构
- [ ] 配置 React Router v6
- [ ] 实现 Vercel 中间件处理多语言子路径
- [ ] 集成 i18next，配置中英文翻译
- [ ] 创建语言切换组件
- [ ] 配置 Zustand 状态管理
- [ ] 搭建 API 适配层框架
- [ ] 定义核心 TypeScript 类型
- [ ] 实现 Shopify Storefront API 客户端
- [ ] 封装通用请求 Hook（基于 TanStack Query）
- [ ] 创建基础布局组件（Header、Footer、Sidebar）

#### Phase 2: 商品模块
- [ ] 实现商品列表页面（分页、筛选、排序）
- [ ] 实现商品详情页面（图片轮播、规格选择、库存显示）
- [ ] 实现商品分类导航
- [ ] 创建商品卡片组件
- [ ] 实现商品搜索功能
- [ ] 添加收藏功能（前端 localStorage）
- [ ] 实现商品数据缓存策略

#### Phase 3: 购物车模块
- [ ] 集成 Shopify Cart API
- [ ] 实现添加到购物车功能
- [ ] 实现购物车列表页面
- [ ] 实现数量修改、删除商品
- [ ] 实现价格计算（小计、合计）
- [ ] 创建购物车抽屉组件
- [ ] 实现购物车状态持久化

#### Phase 4: 用户模块
- [ ] 集成 Shopify Customer API
- [ ] 实现用户注册页面
- [ ] 实现用户登录页面
- [ ] 实现密码重置功能
- [ ] 实现个人中心页面
- [ ] 实现地址管理（增删改查）
- [ ] 实现用户认证路由守卫

#### Phase 5: 订单支付
- [ ] 集成 Shopify Checkout API
- [ ] 实现结算页面（地址选择、物流选择）
- [ ] 集成支付方式（Stripe、PayPal）
- [ ] 实现订单确认页面
- [ ] 实现订单列表页面
- [ ] 实现订单详情页面
- [ ] 实现支付成功/失败回调处理

#### Phase 6: 优化上线
- [ ] 配置 SEO 元数据（动态 title、description）
- [ ] 生成 sitemap.xml 和 robots.txt
- [ ] 性能优化（图片懒加载、代码分割、缓存策略）
- [ ] 响应式调试（移动端、平板、桌面端）
- [ ] 跨浏览器测试
- [ ] 配置 Vercel 部署
- [ ] 绑定自定义域名
- [ ] 配置 HTTPS
- [ ] 全流程测试（商品浏览 → 加购 → 结算 → 支付）

---

## 六、支付系统设计

### 6.1 支付流程

```
用户点击结算
    ↓
前端创建 Shopify Checkout
    ↓
跳转到 Shopify 支付页面
    ↓
用户完成支付（Stripe/PayPal）
    ↓
Shopify 处理支付并创建订单
    ↓
Webhook 通知前端（或轮询订单状态）
    ↓
跳转到支付成功页面
    ↓
订单同步到用户账户
```

### 6.2 支付方式集成

| 支付方式 | 集成方式 | 适用地区 |
|----------|----------|----------|
| **Stripe** | Shopify Payments 内置 | 全球大部分国家/地区 |
| **PayPal** | Shopify Payments 内置 | 全球 |
| **Apple Pay** | Shopify Payments 内置 | 支持 Apple Pay 的地区 |
| **Google Pay** | Shopify Payments 内置 | 支持 Google Pay 的地区 |

### 6.3 支付安全
- 所有支付流程走 Shopify 官方页面，不触碰信用卡信息
- 使用 HTTPS 加密传输
- 配置 Webhook 签名验证，防止伪造回调
- 订单状态需要服务端验证，不依赖前端传递

---

## 七、多语言系统设计

### 7.1 语言策略
- **默认语言**：英文（/en/）
- **第二语言**：中文（/zh/）
- **内容策略**：UI 界面翻译，商品内容统一英文（降低维护成本）
- **扩展预留**：设计上支持更多语言（日语、韩语等）

### 7.2 URL 结构
```
https://example.com/en/products          # 英文商品列表
https://example.com/zh/products          # 中文商品列表
https://example.com/en/products/123      # 英文商品详情
https://example.com/zh/products/123      # 中文商品详情
```

### 7.3 翻译文件结构
```
public/locales/
├── en/
│   ├── common.json        # 通用翻译（按钮、表单等）
│   ├── navigation.json    # 导航菜单
│   ├── product.json       # 商品相关
│   ├── cart.json          # 购物车相关
│   ├── user.json          # 用户相关
│   └── checkout.json      # 结算相关
└── zh/
    ├── common.json
    ├── navigation.json
    ├── product.json
    ├── cart.json
    ├── user.json
    └── checkout.json
```

---

## 八、部署方案

### 8.1 部署架构
- **前端**：Vercel（自动 CI/CD、全球 CDN、边缘计算）
- **后端**：Shopify（SaaS 服务，无需运维）
- **域名**：自定义域名 + SSL 证书（Vercel 自动管理）
- **DNS**：Cloudflare（可选，额外的 CDN 和安全防护）

### 8.2 环境配置

| 环境 | 域名 | Shopify 版本 |
|------|------|-------------|
| **开发环境** | localhost:5173 | 开发店铺 |
| **测试环境** | test.yourdomain.com | 开发店铺 |
| **生产环境** | www.yourdomain.com | 正式店铺 |

### 8.3 Vercel 配置要点
- `vercel.json` 配置 rewrite 规则实现多语言子路径
- 环境变量管理（Shopify API Key、域名等）
- 自定义域名和 HTTPS 配置
- 部署钩子配置（Git push 自动部署）

---

## 九、风险评估与应对

### 9.1 技术风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| Shopify API 限制 | 中 | 中 | 合理使用缓存，设计 fallback 方案 |
| 多语言路由复杂 | 中 | 中 | 充分调研，先做技术验证 |
| 支付流程复杂 | 高 | 高 | 使用 Shopify 官方 Checkout，降低风险 |
| 性能不达标 | 中 | 中 | 提前做性能规划，使用图片 CDN |
| SEO 效果差 | 中 | 高 | 采用 SSR/ISR，配置完善的 meta 标签 |

### 9.2 业务风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| Shopify 费用超支 | 低 | 中 | 关注使用量，选择合适的套餐 |
| 支付账户审核 | 中 | 高 | 提前准备企业资料，尽早申请 |
| 物流对接复杂 | 中 | 中 | MVP 阶段使用 Shopify 自带物流 |
| 数据迁移困难 | 低 | 高 | 适配器模式设计，降低耦合 |

### 9.3 个人开发风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 技术学习曲线 | 中 | 中 | 分阶段学习，边做边学 |
| 开发周期过长 | 高 | 中 | MVP 最小化，快速上线 |
| 需求蔓延 | 高 | 高 | 严格控制范围，后续迭代再加功能 |
| 代码质量下降 | 中 | 中 | 建立规范，AI 辅助审查 |

---

## 十、关键技术难点与解决方案

### 10.1 多语言子路径实现
**难点**：纯前端 SPA 如何实现 /zh/、/en/ 这样的服务端路由
**解决方案**：
- 使用 Vercel 的 rewrite 功能，将所有 /zh/* 和 /en/* 请求重写到 /index.html
- Vercel Middleware 处理语言检测和重定向
- React Router 动态读取 URL 中的语言前缀

### 10.2 Shopify 无头模式集成
**难点**：Storefront API 权限限制，部分操作需要 Admin API
**解决方案**：
- 公开数据（商品、分类）使用 Storefront API
- 敏感操作（订单、用户）使用 Shopify 官方页面跳转
- 自定义逻辑通过 API 适配层封装，便于后续替换

### 10.3 购物车状态同步
**难点**：多设备购物车同步，用户登录后合并购物车
**解决方案**：
- 使用 Shopify Cart ID 标识购物车
- 未登录用户购物车 ID 存在 localStorage
- 用户登录后调用 Shopify API 合并购物车

### 10.4 SEO 优化
**难点**：纯前端 SPA 的 SEO 不友好
**解决方案**：
- 使用 Vercel 的 ISR（Incremental Static Regeneration）
- 关键页面（首页、商品列表、商品详情）预渲染
- 动态生成 sitemap.xml 和 robots.txt
- 配置完善的 Open Graph 和 Twitter Card 标签

---

## 十一、后续扩展方向

### 11.1 功能扩展
- [ ] 商品评价系统
- [ ] 优惠券/促销系统
- [ ] 会员等级/积分系统
- [ ] 商品推荐/关联商品
- [ ] 站内信/通知系统
- [ ] 数据分析看板
- [ ] 多店铺/多供应商
- [ ] 多货币支持

### 11.2 技术扩展
- [ ] PWA 支持（离线浏览、添加到桌面）
- [ ] 后端迁移到 Node.js + Express + PostgreSQL
- [ ] 引入微前端架构
- [ ] 接入 AI 客服机器人
- [ ] 接入搜索服务（Algolia/Elasticsearch）
- [ ] A/B 测试系统

### 11.3 运维扩展
- [ ] 接入监控系统（Sentry、LogRocket）
- [ ] 性能监控（Web Vitals）
- [ ] 错误追踪和告警
- [ ] 自动化测试（单元测试、E2E 测试）
- [ ] CI/CD 流水线完善

---

## 十二、学习资源清单

### 12.1 Shopify 开发
- Shopify 官方文档：https://shopify.dev/docs
- Shopify Storefront API：https://shopify.dev/docs/api/storefront
- Hydrogen（Shopify 官方 React 框架）：https://hydrogen.shopify.dev/

### 12.2 多语言开发
- i18next 官方文档：https://www.i18next.com/
- react-i18next：https://react.i18next.com/
- Vercel i18n 最佳实践：https://nextjs.org/docs/app/building-your-application/routing/internationalization

### 12.3 电商开发
- 电商 UI 设计参考：https://dribbble.com/search/ecommerce
- 电商用户体验指南：https://www.nngroup.com/articles/ecommerce-user-experience/
- 支付流程设计：https://baymard.com/checkout-usability

---

## 十三、下一步行动

1. **确认本计划**：用户审核并确认项目计划
2. **创建项目目录**：按照目录结构创建项目文件夹
3. **初始化项目**：执行 Phase 0 项目初始化任务
4. **配置开发环境**：安装依赖，配置开发工具
5. **开始开发**：按照 Phase 1 到 Phase 6 逐步开发

---

**文档版本**：v1.0  
**创建日期**：2026-05-31  
**最后更新**：2026-05-31
