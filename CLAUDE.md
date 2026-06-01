# E-Commerce Store - AI 开发规范

## 0. AI 操作基本原则

### 语言要求

- 始终使用中文回答。所有对话、解释和代码注释都应使用中文。

### 规则 1 — 编码前先思考

明确陈述假设。不确定时先问，不要猜。
存在歧义时呈现多种理解。
有更简单的做法时主动提出。
困惑就停下来，说清楚哪里不清楚。

### 规则 2 — 简单优先

用最少代码解决问题，不做无根据的臆测。
不添加超出需求的功能。不对只用一次的代码做抽象。
检验标准：资深工程师会觉得过度复杂吗？若是，则简化。

### 规则 3 — 外科手术式修改

只改必须改的部分，只收拾自己弄乱的地方。
不要「顺手改进」相邻代码、注释或格式。
没坏就不要重构。遵循现有风格。

### 规则 4 — 目标驱动执行

定义成功标准，循环迭代直到验证通过。
不要机械执行步骤。定义什么叫成功，再迭代。
清晰的成功标准才能让你独立迭代。

### 规则 5 — 仅将模型用于判断类任务

用我做：分类、起草、摘要、信息提取。
不要用我做：路由、重试、确定性转换。
代码能回答的，就让代码回答。

### 规则 6 — Token 预算不是建议

每任务：4000 token。每会话：30000 token。
接近预算时总结并重新开始。
暴露超预算，不要悄悄超限。

### 规则 7 — 暴露冲突，不要取平均

若两种模式矛盾，选一种（较新 / 测试更充分）。
说明理由，并标记另一套待清理。
不要混搭互相矛盾的范式。

### 规则 8 — 写之前先读

加代码前先读导出、直接调用方、共享工具。
「看起来正交」很危险。若不清楚现有结构为何如此，先问。

### 规则 9 — 测试验证意图，不只验证行为

测试必须编码为何行为重要，而不只是做了什么。
业务逻辑变更时仍不会失败的测试是错的。

### 规则 10 — 每个重要步骤后做检查点

总结做了什么、验证了什么、还剩什么。
不要从无法对当前状态复盘的状态继续。
跟丢了就停下并重新陈述。

### 规则 11 — 匹配代码库惯例，即使你不认同

在代码库内，遵守惯例优先于个人品味。
若真心认为某惯例有害，要明确提出来，不要悄悄分叉。

### 规则 12 — 失败要大声说出来

若有任何事被悄悄跳过，「完成」就是错的。
若有任何测试被跳过，「测试通过」就是错的。
默认暴露不确定性，不要掩盖。

---

## 1. 项目概述

本项目是一个基于 React + TypeScript + Shopify 无头 CMS 的跨境电商独立站 MVP。采用纯前端 + Shopify 无头模式，支持中英文多语言，通过 Netlify 部署。

\*\*核心目标：

- 快速上线 MVP 版本
- 为后续迭代预留架构空间
- 学习 Shopify 无头电商开发

---

## 2. 技术栈

### 2.1 核心框架

- **React 18** - 用户界面库
- **TypeScript 5.8** - 类型安全
- **Vite 6** - 构建工具
- **React Router v7** - 路由管理

### 2.2 样式方案

- **Tailwind CSS 4** - 原子化 CSS 框架
- **Lucide React** - 图标库
- **clsx + tailwind-merge** - 类名合并工具

### 2.3 状态管理

- **Zustand 5** - 轻量级状态管理
- **TanStack Query v5** - 服务端状态管理和数据缓存

### 2.4 多语言方案

- **i18next + react-i18next** - 国际化框架
- **子路径多语言** - `/en/`、`/zh/`，SEO 友好

### 2.5 电商后端

- **Shopify Storefront API** - 无头电商 CMS
- **API 适配层模式** - 封装接口，便于未来替换后端

### 2.6 代码规范

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Husky + lint-staged** - Git Hooks

### 2.7 部署

- **Netlify** - 部署平台

---

## 3. 项目结构

```
ecommerce-store/
├── public/
│   └── locales/          # 多语言翻译文件
│       ├── en/
│       └── zh/
├── src/
│   ├── assets/           # 静态资源
│   ├── components/       # 通用组件
│   │   ├── ui/           # 基础 UI 组件
│   │   ├── product/      # 商品相关组件
│   │   ├── cart/         # 购物车相关组件
│   │   ├── layout/       # 布局组件
│   │   └── locale/       # 多语言相关组件
│   ├── hooks/            # 自定义 Hooks
│   ├── lib/              # 工具库
│   │   ├── i18n/         # 多语言配置
│   │   ├── shopify/      # Shopify 配置
│   │   ├── constants.ts # 常量定义
│   │   └── utils.ts     # 工具函数
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
│   ├── App.tsx          # 根组件
│   ├── main.tsx          # 入口文件
│   └── index.css         # 全局样式
├── .husky/               # Git Hooks
├── netlify.toml          # Netlify 部署配置
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 4. 编码规范

### 4.1 TypeScript 规范

\*\*严格模式，避免使用 `any` 类型，如必须使用需添加注释说明原因。

```typescript
// ✅ 好的做法
interface User {
  id: string
  name: string
}

// ❌ 避免
const data: any = await fetchData()

// ✅ 如必须使用 any，添加注释
// 临时使用 any，后续需要定义完整类型
const result: any = await adapter.getProducts()
```

\*\*类型定义优先使用 `interface`，联合类型使用 `type`。

\*\*导入路径别名使用 `@/` 前缀：

```typescript
import { Product } from '@/types/product'
import { useProduct } from '@/hooks/useProduct'
```

### 4.2 React 组件规范

\*\*使用函数式组件 + Hooks：

```tsx
// ✅ 好的做法
interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { t } = useTranslation()
  const handleClick = () => onAddToCart(product.id)

  return (
    <div onClick={handleClick}>
      <h3>{product.title}</h3>
    </div>
  )
}

// 默认导出
export default ProductCard
```

\*\*组件命名使用 PascalCase，文件名与组件名一致。

\*\*Props 接口命名为 `ComponentNameProps`。

### 4.3 Tailwind CSS 4 规范

\*\*使用 Tailwind CSS 4 的 `@theme` 定义主题变量：

```css
@theme {
  --color-primary: #22c55e;
  --color-secondary: #64748b;
}
```

\*\*避免在 `@apply` 中使用自定义颜色名，直接使用 CSS 变量：

```css
/* ✅ 好的做法 */
.button {
  background-color: var(--color-primary);
}

/* ❌ 避免 */
.button {
  @apply bg-primary;
}
```

\*\*类名合并使用 `cn` 工具函数：

```tsx
import { cn } from '@/lib/utils'

;<div className={cn('flex', isActive && 'bg-primary')} />
```

### 4.4 多语言规范

\*\*使用 `useTranslation` Hook 获取翻译函数：

```tsx
const { t } = useTranslation();

// ✅ 好的做法
<button>{t('common.addToCart')}</button>

// ❌ 避免
<button>Add to Cart</button>
```

\*\*翻译文件按模块组织：

- `common.json` - 通用翻译（按钮、表单等）
- `product.json` - 商品相关
- `cart.json` - 购物车相关
- `user.json` - 用户相关
- `checkout.json` - 结算相关

### 4.5 API 调用规范

\*\*使用 TanStack Query 进行数据请求：

```tsx
// ✅ 好的做法
const { data, isLoading, error } = useProducts()

if (isLoading) return <Loading />
if (error) return <Error message={error.message} />

return <ProductList products={data.products} />
```

\*\*通过服务层调用 API，不直接在组件中调用适配器：

```typescript
// ✅ 好的做法
import { useGetProducts } from '@/services/productService'

// ❌ 避免
import { ShopifyAdapter } from '@/services/adapters/shopify'
```

### 4.6 状态管理规范

\*\*全局状态使用 Zustand：

```typescript
// stores/cartStore.ts
import { create } from 'zustand'

interface CartState {
  cartId: string | null
  setCartId: (id: string | null) => void
}

export const useCartStore = create<CartState>((set) => ({
  cartId: null,
  setCartId: (id) => set({ cartId: id }),
}))
```

\*\*服务端状态使用 TanStack Query，客户端状态使用 Zustand。

---

## 5. 开发流程

### 5.1 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 类型检查
npm run check

# 代码检查
npm run lint

# 代码格式化
npm run format

# 预览构建结果
npm run preview
```

### 5.2 Git 提交规范

\*\*提交前自动运行 ESLint 和 Prettier。

\*\*提交信息遵循 Conventional Commits：

```
feat: 添加商品列表页面
fix: 修复购物车数量计算错误
docs: 更新 README 文档
style: 调整按钮样式
refactor: 重构 API 适配层
test: 添加单元测试
chore: 更新依赖版本
```

### 5.3 环境变量

**.env.example** 包含所有需要配置的环境变量：

```
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_API_TOKEN=your-api-token
VITE_SHOPIFY_API_VERSION=2024-07
```

**复制为 `.env.local` 并填写实际值。

### 5.4 阶段提交规范

**每个开发阶段完成后必须提交到本地 Git 仓库进行存档。**

**提交要求：**
- 无论是否配置远程仓库，每个阶段结束后都要提交到本地仓库
- 提交信息需明确标注阶段名称和完成的内容
- 确保代码可正常运行后再提交
- 提交前运行 `npm run check` 和 `npm run lint` 确保代码质量

**阶段提交示例：**
```
# 阶段 0 完成
git commit -m "phase(0): 项目初始化完成

- 搭建项目基础架构
- 配置开发工具和规范
- 创建 AI 代理配置文档"

# 阶段 1 完成
git commit -m "phase(1): 基础架构完成

- 实现多语言路由系统
- 搭建 API 适配层
- 配置状态管理方案"
```

---

## 6. API 适配层模式

### 6.1 适配器接口

\*\*所有后端调用通过统一的适配器接口 `IEcommerceAdapter`：

```typescript
export interface IEcommerceAdapter {
  getProducts(filter?: ProductFilter): Promise<ProductConnection>
  getProduct(handle: string): Promise<Product | null>
  createCart(input?: CartInput): Promise<Cart>
  // ... 其他方法
}
```

### 6.2 当前实现：ShopifyAdapter

\*\*在 `src/services/adapters/shopify/index.ts` 中实现。

### 6.3 未来扩展

\*\*如需替换后端，只需创建新的适配器实现 `IEcommerceAdapter` 接口，无需修改前端代码。

---

## 7. 多语言路由

### 7.1 URL 结构

```
/en/products          # 英文商品列表
/zh/products          # 中文商品列表
/en/products/handle    # 英文商品详情
/zh/products/handle    # 中文商品详情
```

### 7.2 Netlify 配置

\*\*`netlify.toml` 中配置 rewrite 规则：

```toml
[[redirects]]
  from = "/en/*"
  to = "/:splat"
  status = 200

[[redirects]]
  from = "/zh/*"
  to = "/:splat"
  status = 200
```

---

## 8. 常见开发模式

### 8.1 新增页面

1. 在 `src/pages/` 创建页面组件
2. 在 `src/App.tsx` 中添加路由
3. 添加对应翻译

### 8.2 新增组件

1. 在 `src/components/` 对应目录创建组件
2. 定义 Props 接口
3. 添加默认导出

### 8.3 新增 API 调用

1. 在 `src/services/adapters/interface.ts` 添加接口方法
2. 在 `ShopifyAdapter` 中实现
3. 在对应的 `xxxService.ts` 中封装 React Query Hook

---

## 9. 性能优化

### 9.1 图片优化

- 使用 Shopify CDN 优化图片
- 添加 `loading="lazy"` 懒加载
- 使用 `srcset` 响应式图片

### 9.2 代码分割

- 路由级别代码分割
- 组件级别按需加载

### 9.3 数据缓存

- TanStack Query 缓存策略
- 合理设置 `staleTime` 和 `cacheTime`

---

## 10. 安全规范

- 不存储敏感信息到 localStorage（密码等）
- 使用 HTTPS
- 防止 XSS 攻击（React 默认转义）
- Shopify API Token 仅限公开权限

---

## 11. 测试策略

- 单元测试：工具函数、纯函数
- 组件测试：关键交互逻辑
- E2E 测试：核心购买流程

---

## 12. 部署

### Netlify 部署

1. 推送代码到 Git 仓库
2. 在 Netlify 中关联仓库
3. 配置环境变量
4. 自动部署

---

**文档版本**: v1.0
**最后更新**: 2026-05-31
