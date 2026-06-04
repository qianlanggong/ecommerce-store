# 开发规范与最佳实践

---

## 📑 文档元数据

| 字段 | 值 |
|------|-----|
| **文档编号** | DOC-DEV-2026-001 |
| **文档版本** | v1.0 |
| **项目名称** | 跨境电商独立站 MVP |
| **创建日期** | 2026-06-04 |
| **最后更新** | 2026-06-04 |
| **文档类型** | 开发规范 |
| **所属阶段** | Phase 0-5 完成 |
| **编写人** | AI 开发助手 |
| **审核人** | 项目负责人 |
| **机密等级** | 内部公开 |
| **关联文档** | [ecommerce_store_plan.md](file:///d:/Atemp/cc/ecommerce-store/.trae/documents/ecommerce_store_plan.md), [api_reference.md](file:///d:/Atemp/cc/ecommerce-store/.trae/documents/api_reference.md) |
| **关联 Commit** | `622f78e` (Phase 5) |
| **标签** | `开发规范`, `最佳实践`, `代码质量`, `TypeScript`, `React`, `Tailwind CSS` |

---

## 1. 概述

本文档定义了电商项目的开发规范和最佳实践，旨在确保代码质量、可维护性和团队协作效率。所有开发人员必须遵守本文档中的规范。

### 1.1 核心原则

1. **类型安全优先**: 尽可能使用 TypeScript 严格类型，避免 `any` 类型
2. **简单优先**: 用最少代码解决问题，不做无根据的臆测
3. **一致优先**: 遵循现有代码风格和项目惯例
4. **测试驱动**: 重要逻辑必须有测试覆盖
5. **文档完善**: 复杂逻辑和设计决策必须有文档说明

---

## 2. 项目结构规范

### 2.1 目录结构

```
ecommerce-store/
├── public/
│   └── locales/              # 多语言翻译文件
│       ├── en/
│       └── zh/
├── src/
│   ├── assets/               # 静态资源
│   ├── components/           # 通用组件
│   │   ├── ui/               # 基础 UI 组件
│   │   ├── product/          # 商品相关组件
│   │   ├── cart/             # 购物车相关组件
│   │   ├── layout/           # 布局组件
│   │   └── locale/           # 多语言相关组件
│   ├── hooks/                # 自定义 Hooks
│   ├── lib/                  # 工具库
│   │   ├── i18n/            # 多语言配置
│   │   ├── shopify/          # Shopify 配置
│   │   ├── constants.ts      # 常量定义
│   │   └── utils.ts         # 工具函数
│   ├── pages/                # 页面组件
│   ├── services/             # 服务层
│   │   ├── adapters/         # API 适配器
│   │   │   ├── interface.ts
│   │   │   ├── shopify/
│   │   │   └── mock/
│   │   ├── api/              # API 客户端
│   │   ├── productService.ts
│   │   ├── cartService.ts
│   │   ├── userService.ts
│   │   └── checkoutService.ts
│   ├── stores/               # Zustand 状态管理
│   ├── types/                # TypeScript 类型定义
│   ├── App.tsx               # 根组件
│   ├── main.tsx              # 入口文件
│   └── index.css             # 全局样式
├── .husky/                   # Git Hooks
├── netlify.toml              # Netlify 部署配置
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### 2.2 文件命名规范

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| 组件 | PascalCase | `ProductCard.tsx` |
| 页面 | PascalCase + Page | `ProductListPage.tsx` |
| Hook | camelCase + use | `useProduct.ts` |
| 工具函数 | camelCase | `formatPrice.ts` |
| 类型定义 | camelCase | `product.ts` |
| 服务 | camelCase + Service | `productService.ts` |
| 状态管理 | camelCase + Store | `cartStore.ts` |
| 常量 | UPPER_SNAKE_CASE | `API_VERSION = '2024-07'` |

---

## 3. TypeScript 规范

### 3.1 类型定义优先

**✅ 好的做法**:

```typescript
interface Product {
  id: string
  title: string
  price: Money
}

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // ...
}
```

**❌ 避免**:

```typescript
// 使用 any 类型
const data: any = await fetchData()

// 不定义 Props 接口
export function ProductCard(props: any) {
  // ...
}
```

### 3.2 类型注解

- 函数参数必须有类型注解
- 函数返回值建议添加类型注解
- 复杂对象必须定义接口

```typescript
// ✅ 好的做法
function calculateTotal(items: CartItem[], taxRate: number): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 + taxRate)
}

// ❌ 避免
function calculateTotal(items, taxRate) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 + taxRate)
}
```

### 3.3 类型断言

- 尽量避免类型断言
- 必须使用时添加注释说明原因
- 优先使用类型守卫

```typescript
// ✅ 好的做法 - 类型守卫
function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'price' in value
  )
}

// ⚠️ 必要时使用类型断言并添加注释
// 后端返回的数据结构已知，此处断言为 Product[]
const products = response.data as Product[]
```

### 3.4 泛型使用

优先使用泛型提高代码复用性：

```typescript
// ✅ 好的做法
function useQuery<T>(queryKey: string[], queryFn: () => Promise<T>) {
  // ...
}

// 使用
const { data } = useQuery<Product[]>(['products'], () => fetchProducts())
```

### 3.5 避免的类型

- 禁止使用 `any` 类型（除非有充分理由并添加注释）
- 谨慎使用 `unknown` 类型，必须配合类型守卫
- 避免使用 `object` 类型，应定义具体接口

---

## 4. React 组件规范

### 4.1 组件结构

**✅ 推荐的组件结构**:

```tsx
// 1. 导入语句
import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

// 2. Props 接口定义
interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
  className?: string
}

// 3. 组件函数
export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  // 3.1 Hooks
  const { t } = useTranslation()
  const [isAdding, setIsAdding] = useState(false)

  // 3.2 回调函数
  const handleClick = useCallback(() => {
    setIsAdding(true)
    onAddToCart(product.id)
    setTimeout(() => setIsAdding(false), 500)
  }, [product.id, onAddToCart])

  // 3.3 渲染
  return (
    <div
      className={cn('rounded-lg border p-4', className)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <h3 className="text-lg font-semibold">{product.title}</h3>
      <p className="text-primary font-medium">{formatPrice(product.price)}</p>
    </div>
  )
}

// 4. 默认导出
export default ProductCard
```

### 4.2 Hooks 使用规范

#### 4.2.1 Hook 调用顺序

- 只能在函数组件顶层调用 Hook
- 不能在条件语句、循环或嵌套函数中调用

```typescript
// ✅ 好的做法
function MyComponent() {
  const [count, setCount] = useState(0)
  const { data } = useProducts()
  // ...
}

// ❌ 错误
function MyComponent() {
  if (condition) {
    const [count, setCount] = useState(0) // ❌ 不能在条件中调用
  }
  // ...
}
```

#### 4.2.2 useEffect 依赖

- 列出所有在 effect 中使用的变量
- 使用 `useCallback` 和 `useMemo` 避免不必要的重渲染
- 复杂逻辑考虑抽离为自定义 Hook

```typescript
// ✅ 好的做法
const fetchProduct = useCallback(async (id: string) => {
  const response = await fetch(`/api/products/${id}`)
  return response.json()
}, [])

useEffect(() => {
  if (productId) {
    fetchProduct(productId)
  }
}, [productId, fetchProduct])
```

#### 4.2.3 自定义 Hook 命名

- 使用 `use` 前缀
- 返回数组或对象，保持一致

```typescript
// ✅ 好的做法 - 返回对象
export function useProduct(handle: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: productKeys.detail(handle),
    queryFn: () => adapter.getProduct(handle),
  })

  return { product: data, isLoading, error }
}

// 使用
const { product, isLoading, error } = useProduct(handle)
```

### 4.3 状态管理规范

#### 4.3.1 状态分类

| 状态类型 | 管理方案 | 示例 |
|----------|----------|------|
| 本地组件状态 | `useState`, `useReducer` | 表单输入、展开/收起 |
| 服务端状态 | TanStack Query | 商品数据、购物车数据 |
| 全局 UI 状态 | Zustand | Toast 通知、主题切换 |
| URL 状态 | React Router | 搜索参数、筛选条件 |

#### 4.3.2 Zustand 状态管理

```typescript
// ✅ 好的做法
import { create } from 'zustand'

interface CartState {
  cartId: string | null
  isCartOpen: boolean
  setCartId: (id: string | null) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  cartId: null,
  isCartOpen: false,

  setCartId: (id) => set({ cartId: id }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
}))
```

#### 4.3.3 TanStack Query 使用规范

```typescript
// ✅ 好的做法 - 分层 Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filter: ProductFilter) => [...productKeys.lists(), filter] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (handle: string) => [...productKeys.details(), handle] as const,
}

// 合理设置缓存时间
export function useProduct(handle: string) {
  return useQuery({
    queryKey: productKeys.detail(handle),
    queryFn: () => adapter.getProduct(handle),
    staleTime: 10 * 60 * 1000, // 10 分钟
    enabled: !!handle,
  })
}
```

### 4.4 性能优化

#### 4.4.1 组件优化

```typescript
// ✅ 使用 memo 避免不必要重渲染
export const ProductCard = memo(function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // ...
})

// ✅ 使用 useCallback 缓存回调
const handleAddToCart = useCallback((productId: string) => {
  // ...
}, [])

// ✅ 使用 useMemo 缓存计算结果
const totalPrice = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}, [items])
```

#### 4.4.2 代码分割

```tsx
// ✅ 路由级别代码分割
import { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const ProductListPage = lazy(() => import('@/pages/ProductListPage'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Route path="/products" element={<ProductListPage />} />
    </Suspense>
  )
}
```

---

## 5. Tailwind CSS 4 规范

### 5.1 主题定义

在 `src/index.css` 中使用 `@theme` 定义主题变量：

```css
@theme {
  /* 颜色 */
  --color-primary: #22c55e;
  --color-primary-dark: #16a34a;
  --color-secondary: #64748b;
  --color-accent: #f59e0b;

  /* 字体 */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;

  /* 间距 */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;

  /* 圆角 */
  --radius-2xl: 1rem;
}
```

### 5.2 类名使用

**✅ 好的做法**:

```css
/* 使用 CSS 变量访问主题 */
.button {
  background-color: var(--color-primary);
  font-family: var(--font-display);
  padding: var(--spacing-4);
}

/* 组件内部使用 Tailwind 类名 */
<div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-white shadow-sm">
```

**❌ 避免**:

```css
/* 不要在 @apply 中使用自定义颜色名 */
.button {
  @apply bg-primary; /* ❌ Tailwind CSS 4 不支持 */
}
```

### 5.3 类名合并

使用 `cn` 工具函数合并类名：

```tsx
import { cn } from '@/lib/utils'

// ✅ 好的做法
<div
  className={cn(
    'flex items-center gap-2 px-4 py-2 rounded-lg',
    isActive && 'bg-primary text-white',
    className
  )}
/>
```

### 5.4 响应式设计

遵循移动端优先原则：

```tsx
// ✅ 好的做法 - 移动端优先
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
```

### 5.5 可访问性 (a11y)

```tsx
// ✅ 好的做法
<button
  type="button"
  aria-label="关闭购物车"
  onClick={handleClose}
  className="p-2 rounded-full hover:bg-gray-100"
>
  <X size={20} aria-hidden="true" />
</button>

// ✅ 图片必须有 alt 文本
<img
  src={product.image.url}
  alt={product.image.altText || product.title}
  loading="lazy"
/>
```

---

## 6. API 调用规范

### 6.1 服务层调用

**✅ 好的做法** - 通过服务层 Hooks 调用 API：

```tsx
import { useProducts, useAddCartLines } from '@/services/productService'

function ProductListPage() {
  const { data, isLoading, error } = useProducts({ first: 12 })
  const addCartLines = useAddCartLines()

  if (isLoading) return <Loading />
  if (error) return <Error message={error.message} />

  return (
    <ProductGrid
      products={data.edges.map(edge => edge.node)}
      onAddToCart={(variantId) => {
        addCartLines.mutate({
          cartId,
          lines: [{ merchandiseId: variantId, quantity: 1 }],
        })
      }}
    />
  )
}
```

**❌ 避免** - 直接在组件中调用适配器：

```tsx
import { ShopifyAdapter } from '@/services/adapters/shopify' // ❌ 不要这样
```

### 6.2 错误处理

```tsx
// ✅ 好的做法 - 统一错误处理
export function useAddCartLines() {
  const { t } = useTranslation('cart')

  return useMutation({
    mutationFn: ({ cartId, lines }) => adapter.addCartLines(cartId, lines),
    onSuccess: () => {
      useToastStore.getState().addToast(t('addSuccess'), 'success')
    },
    onError: () => {
      useToastStore.getState().addToast(t('addError'), 'error')
    },
  })
}
```

### 6.3 加载状态

```tsx
// ✅ 好的做法 - 显示加载状态
const { data, isLoading } = useProducts()

if (isLoading) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
```

---

## 7. 多语言规范

### 7.1 翻译使用

```tsx
// ✅ 好的做法
import { useTranslation } from 'react-i18next'

function ProductCard() {
  const { t } = useTranslation('product')

  return (
    <button>
      {t('addToCart')}
    </button>
  )
}

// ❌ 避免 - 硬编码文本
<button>Add to Cart</button>
```

### 7.2 翻译文件组织

按模块组织翻译文件：

```
public/locales/
├── en/
│   ├── common.json      # 通用翻译（按钮、表单等）
│   ├── product.json     # 商品相关
│   ├── cart.json        # 购物车相关
│   ├── user.json        # 用户相关
│   └── checkout.json    # 结算相关
└── zh/
    ├── common.json
    ├── product.json
    ├── cart.json
    ├── user.json
    └── checkout.json
```

### 7.3 翻译 Key 命名规范

- 使用 `.` 分隔层级
- 命名清晰，反映用途
- 通用翻译放在 `common.json`

```json
{
  "addToCart": "加入购物车",
  "checkout": {
    "title": "结算",
    "steps": {
      "information": "信息",
      "shipping": "配送",
      "payment": "支付"
    }
  }
}
```

---

## 8. 测试规范

### 8.1 测试类型

| 测试类型 | 覆盖范围 | 工具 |
|----------|----------|------|
| 单元测试 | 工具函数、纯函数 | Vitest |
| 组件测试 | 关键交互逻辑 | Vitest + React Testing Library |
| E2E 测试 | 核心购买流程 | Playwright |

### 8.2 测试命名规范

```typescript
// ✅ 好的做法
describe('formatPrice', () => {
  it('should format price with currency symbol', () => {
    expect(formatPrice({ amount: '99.99', currencyCode: 'USD' })).toBe('$99.99')
  })

  it('should handle zero price', () => {
    expect(formatPrice({ amount: '0', currencyCode: 'USD' })).toBe('$0.00')
  })
})
```

### 8.3 测试最佳实践

1. **测试意图，不只是行为**：测试必须编码为何行为重要
2. **避免过度测试**：不要测试实现细节，测试公共接口
3. **保持测试独立**：每个测试应该独立运行
4. **使用合理的测试数据**：使用接近真实场景的测试数据

---

## 9. Git 提交规范

### 9.1 提交信息格式

遵循 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<optional body>

<optional footer>
```

### 9.2 类型说明

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响功能） |
| `refactor` | 重构（不新增功能，不修复 Bug） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建、工具、依赖等 |
| `phase` | 阶段完成提交 |

### 9.3 提交示例

```
feat(cart): 添加购物车抽屉组件

- 实现购物车抽屉的展开/收起动画
- 添加商品数量增减功能
- 实现购物车商品删除功能

Closes #123
```

```
fix(product): 修复商品变体选择不更新价格的问题

当用户选择不同变体时，价格没有实时更新。
根因是变体 ID 变化时没有触发重新查询。

Closes #145
```

```
phase(5): 订单支付模块开发完成

- 实现 Checkout 类型定义
- 实现 Checkout API 接口
- 开发结算页面（多步骤流程）
- 实现折扣码功能
- 集成 Shopify 支付跳转
```

---

## 10. 代码审查清单

### 10.1 TypeScript

- [ ] 没有 `any` 类型（必要时需添加注释说明）
- [ ] 所有函数参数有类型注解
- [ ] 复杂对象定义了接口
- [ ] 类型断言有合理理由

### 10.2 React

- [ ] 组件遵循正确的结构规范
- [ ] Hooks 调用顺序正确
- [ ] useEffect 依赖完整
- [ ] 使用了合适的性能优化（memo, useCallback, useMemo）

### 10.3 样式

- [ ] 使用 Tailwind CSS 4 正确语法
- [ ] 没有在 `@apply` 中使用自定义颜色名
- [ ] 响应式设计实现完整
- [ ] 可访问性考虑周全

### 10.4 API 调用

- [ ] 通过服务层 Hooks 调用 API
- [ ] 错误处理完善
- [ ] 加载状态显示
- [ ] 合理设置缓存时间

### 10.5 多语言

- [ ] 所有文本使用翻译
- [ ] 翻译 Key 命名规范
- [ ] 中英文翻译完整

### 10.6 安全

- [ ] 没有存储敏感信息到 localStorage
- [ ] 避免使用 `dangerouslySetInnerHTML`
- [ ] 输入验证完善
- [ ] XSS 防护到位

---

## 11. 性能优化清单

### 11.1 图片优化

- [ ] 图片使用懒加载 `loading="lazy"`
- [ ] 使用响应式图片 `srcset`
- [ ] 图片格式优化（WebP, AVIF）
- [ ] 使用 Shopify CDN 优化图片尺寸

### 11.2 代码优化

- [ ] 路由级别代码分割
- [ ] 组件按需加载
- [ ] 大型库使用 tree shaking
- [ ] 避免不必要的重渲染

### 11.3 数据优化

- [ ] 合理使用 TanStack Query 缓存
- [ ] 避免过度请求
- [ ] 使用游标分页
- [ ] 预加载关键数据

---

## 12. 常见问题

### 12.1 Tailwind CSS 4 常见问题

**Q: 为什么 `@apply bg-primary` 不工作？**

A: Tailwind CSS 4 中不能在 `@apply` 中使用自定义颜色名。需要直接使用 CSS 变量：

```css
/* 错误 */
.button {
  @apply bg-primary;
}

/* 正确 */
.button {
  background-color: var(--color-primary);
}
```

### 12.2 Shopify API 常见问题

**Q: Storefront API 和 Admin API 有什么区别？**

A: Storefront API 用于公开数据（商品、购物车），Admin API 用于敏感操作（订单、库存）。本项目只使用 Storefront API，敏感操作通过 Shopify 官方页面处理。

### 12.3 多语言常见问题

**Q: 如何添加新语言？**

A:

1. 在 `netlify.toml` 添加 rewrite 规则
2. 在 `src/types/locale.ts` 添加语言类型
3. 在 `public/locales/` 创建翻译目录
4. 在 `src/lib/i18n/config.ts` 配置语言

---

## 13. 相关文档

- [项目开发计划](ecommerce_store_plan.md)
- [API 接口文档](api_reference.md)
- [CLAUDE.md 开发规范](../CLAUDE.md)
- [AGENTS.md 代理配置](../AGENTS.md)

---

## 14. 变更历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-06-04 | 初始版本，包含完整的开发规范和最佳实践 |

