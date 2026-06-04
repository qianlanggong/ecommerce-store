# API 接口文档

---

## 📑 文档元数据

| 字段 | 值 |
|------|-----|
| **文档编号** | DOC-API-2026-001 |
| **文档版本** | v1.0 |
| **项目名称** | 跨境电商独立站 MVP |
| **创建日期** | 2026-06-04 |
| **最后更新** | 2026-06-04 |
| **文档类型** | API 接口文档 |
| **所属阶段** | Phase 0-5 完成 |
| **编写人** | AI 开发助手 |
| **审核人** | 项目负责人 |
| **机密等级** | 内部公开 |
| **关联文档** | [ecommerce_store_plan.md](file:///d:/Atemp/cc/ecommerce-store/.trae/documents/ecommerce_store_plan.md), [development_guide.md](file:///d:/Atemp/cc/ecommerce-store/.trae/documents/development_guide.md) |
| **关联 Commit** | `622f78e` (Phase 5) |
| **标签** | `API文档`, `接口定义`, `适配器模式`, `Shopify`, `React Query` |

---

## 1. 概述

本文档详细描述了电商项目的 API 接口设计，采用**适配器模式**封装所有后端调用，实现前端代码与具体后端实现解耦。通过 `IEcommerceAdapter` 接口定义了统一的 API 契约，所有具体实现（Shopify、Mock、自定义后端）必须遵守此接口。

### 1.1 架构设计

```
┌─────────────────┐     ┌────────────────────┐     ┌──────────────────┐
│  Frontend UI   │────▶│  Service Layer     │────▶│  Adapter Layer   │
│  Components   │     │  (React Query)    │     │  (IEcommerceAdapter) │
└─────────────────┘     └────────────────────┘     └──────────────────┘
                                                               │
                        ┌──────────────┬──────────────┐
                        ▼              ▼              ▼
                ┌──────────┐      ┌─────────┐    ┌──────────┐
                │ Shopify  │      │  Mock   │    │  Custom  │
                │ Adapter  │      │ Adapter │    │  Adapter │
                └──────────┘      └─────────┘    └──────────┘
```

### 1.2 核心设计原则

1. **类型安全**: 所有接口使用 TypeScript 严格类型定义，避免 `any` 类型
2. **错误处理**: 统一的错误返回格式，包含错误代码和详细信息
3. **缓存策略**: 使用 TanStack Query 进行数据缓存，合理设置 `staleTime`
4. **可扩展性**: 适配器模式支持无缝切换后端实现
5. **分页支持**: 采用 Relay 风格的 Connection 模式处理列表数据

---

## 2. 适配器接口定义

### 2.1 IEcommerceAdapter

所有后端适配器必须实现此接口，定义在 [`src/services/adapters/interface.ts`](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/interface.ts)。

---

## 3. 商品模块 API

### 3.1 获取商品列表

**接口方法**: `getProducts(filter?: ProductFilter): Promise<ProductConnection>`

**功能描述**: 根据筛选条件获取商品列表，支持分页、排序、价格范围、分类等多种筛选条件。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `filter.query` | `string` | 否 | 搜索关键词 |
| `filter.sortKey` | `string` | 否 | 排序字段：`TITLE` \| `PRICE` \| `CREATED` \| `BEST_SELLING` \| `RELEVANCE` |
| `filter.reverse` | `boolean` | 否 | 是否倒序排列 |
| `filter.first` | `number` | 否 | 返回数量（前 N 条） |
| `filter.last` | `number` | 否 | 返回数量（后 N 条） |
| `filter.after` | `string` | 否 | 游标分页参数 |
| `filter.before` | `string` | 否 | 游标分页参数 |
| `filter.minPrice` | `string` | 否 | 最低价格 |
| `filter.maxPrice` | `string` | 否 | 最高价格 |
| `filter.productType` | `string` | 否 | 商品类型 |
| `filter.vendor` | `string` | 否 | 供应商 |
| `filter.tag` | `string` | 否 | 标签 |
| `filter.available` | `boolean` | 否 | 是否有货 |

**返回值**: `Promise<ProductConnection>`

```typescript
interface ProductConnection {
  edges: Array<{ node: Product }>
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor?: string
    endCursor?: string
  }
}
```

**使用示例**:

```typescript
// React Query Hook
const { data, isLoading, error } = useProducts({
  sortKey: 'PRICE',
  reverse: false,
  first: 12,
  minPrice: '10',
  maxPrice: '100',
})
```

---

### 3.2 获取商品详情

**接口方法**: `getProduct(handle: string): Promise<Product | null>`

**功能描述**: 根据商品 Handle 获取单个商品的完整详情。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `handle` | `string` | 是 | 商品的 URL 友好标识符 |

**返回值**: `Promise<Product | null>` - 商品详情对象，未找到返回 `null`

**使用示例**:

```typescript
const { data: product, isLoading } = useProduct('t-shirt-white')
```

---

### 3.3 获取商品推荐

**接口方法**: `getProductRecommendations(productId: string): Promise<Product[]>`

**功能描述**: 根据商品 ID 获取相关推荐商品列表。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `productId` | `string` | 是 | 商品的唯一标识符 |

**返回值**: `Promise<Product[]>` - 推荐商品数组

**使用示例**:

```typescript
const { data: recommendations } = useProductRecommendations(productId)
```

---

### 3.4 获取商品分类列表

**接口方法**: `getCollections(): Promise<CollectionConnection>`

**功能描述**: 获取所有商品分类（Collection）列表。

**返回值**: `Promise<CollectionConnection>`

---

### 3.5 获取分类详情

**接口方法**: `getCollection(handle: string): Promise<Collection | null>`

**功能描述**: 根据分类 Handle 获取单个分类详情及其商品列表。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `handle` | `string` | 是 | 分类的 URL 友好标识符 |

**返回值**: `Promise<Collection | null>`

---

## 4. 购物车模块 API

### 4.1 创建购物车

**接口方法**: `createCart(input?: CartInput): Promise<Cart>`

**功能描述**: 创建新的购物车，可预先添加商品、设置买家信息等。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `input.lines` | `CartLineInput[]` | 否 | 要添加的商品行数组 |
| `input.buyerIdentity` | `CartBuyerIdentityInput` | 否 | 买家身份信息 |
| `input.discountCodes` | `string[]` | 否 | 折扣码数组 |
| `input.note` | `string` | 否 | 备注 |
| `input.attributes` | `AttributeInput[]` | 否 | 自定义属性 |

**返回值**: `Promise<Cart>` - 新创建的购物车对象

---

### 4.2 获取购物车详情

**接口方法**: `getCart(cartId: string): Promise<Cart | null>`

**功能描述**: 根据购物车 ID 获取购物车详情。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cartId` | `string` | 是 | 购物车的唯一标识符 |

**返回值**: `Promise<Cart | null>`

---

### 4.3 添加商品到购物车

**接口方法**: `addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart>`

**功能描述**: 向购物车添加商品。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cartId` | `string` | 是 | 购物车 ID |
| `lines` | `CartLineInput[]` | 是 | 要添加的商品行数组 |

**返回值**: `Promise<Cart>` - 更新后的购物车

---

### 4.4 更新购物车商品

**接口方法**: `updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart>`

**功能描述**: 更新购物车中商品的数量或变体。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cartId` | `string` | 是 | 购物车 ID |
| `lines` | `CartLineUpdateInput[]` | 是 | 要更新的商品行数组 |

**返回值**: `Promise<Cart>`

---

### 4.5 移除购物车商品

**接口方法**: `removeCartLines(cartId: string, lineIds: string[]): Promise<Cart>`

**功能描述**: 从购物车移除指定的商品行。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cartId` | `string` | 是 | 购物车 ID |
| `lineIds` | `string[]` | 是 | 要移除的商品行 ID 数组 |

**返回值**: `Promise<Cart>`

---

### 4.6 更新购物车买家身份

**接口方法**: `updateCartBuyerIdentity(cartId: string, buyerIdentity: { email?: string; customerAccessToken?: string; countryCode?: string }): Promise<Cart>`

**功能描述**: 更新购物车的买家身份信息，用于计算税费和运费。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cartId` | `string` | 是 | 购物车 ID |
| `buyerIdentity.email` | `string` | 否 | 买家邮箱 |
| `buyerIdentity.customerAccessToken` | `string` | 否 | 用户访问令牌 |
| `buyerIdentity.countryCode` | `string` | 否 | 国家代码 |

**返回值**: `Promise<Cart>`

---

### 4.7 更新购物车折扣码

**接口方法**: `updateCartDiscountCodes(cartId: string, discountCodes: string[]): Promise<Cart>`

**功能描述**: 更新购物车的折扣码，传空数组可移除所有折扣。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cartId` | `string` | 是 | 购物车 ID |
| `discountCodes` | `string[]` | 是 | 折扣码数组 |

**返回值**: `Promise<Cart>`

---

## 5. 用户模块 API

### 5.1 用户注册

**接口方法**: `createCustomer(input: CustomerCreateInput): Promise<{ customer?: Customer; userErrors: UserError[] }>`

**功能描述**: 创建新用户账户。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `input.email` | `string` | 是 | 用户邮箱 |
| `input.password` | `string` | 是 | 用户密码 |
| `input.firstName` | `string` | 否 | 名 |
| `input.lastName` | `string` | 否 | 姓 |
| `input.phone` | `string` | 否 | 手机号 |
| `input.acceptsMarketing` | `boolean` | 否 | 是否接受营销邮件 |

**返回值**:

```typescript
{
  customer?: Customer          // 创建成功时返回用户对象
  userErrors: UserError[]     // 错误信息数组
}
```

---

### 5.2 用户登录

**接口方法**: `login(email: string, password: string): Promise<{ customerAccessToken?: CustomerAccessToken; userErrors: UserError[] }>`

**功能描述**: 用户登录验证，返回访问令牌。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `string` | 是 | 用户邮箱 |
| `password` | `string` | 是 | 用户密码 |

**返回值**:

```typescript
{
  customerAccessToken?: {
    accessToken: string        // 访问令牌
    expiresAt: string        // 过期时间
  }
  userErrors: UserError[]
}
```

---

### 5.3 用户登出

**接口方法**: `logout(accessToken: string): Promise<void>`

**功能描述**: 注销用户访问令牌。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `accessToken` | `string` | 是 | 当前用户的访问令牌 |

**返回值**: `Promise<void>`

---

### 5.4 获取当前用户信息

**接口方法**: `getCustomer(accessToken: string): Promise<Customer | null>`

**功能描述**: 获取当前登录用户的详细信息。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `accessToken` | `string` | 是 | 用户访问令牌 |

**返回值**: `Promise<Customer | null>`

---

### 5.5 更新用户信息

**接口方法**: `updateCustomer(accessToken: string, input: CustomerUpdateInput): Promise<{ customer?: Customer; userErrors: UserError[] }>`

**功能描述**: 更新用户的个人信息。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `accessToken` | `string` | 是 | 用户访问令牌 |
| `input` | `CustomerUpdateInput` | 是 | 要更新的用户信息 |

**返回值**: 包含更新后的用户对象和可能的错误信息

---

### 5.6 重置用户密码

**接口方法**: `resetPassword(password: string, resetToken: string): Promise<{ customer?: Customer; userErrors: UserError[] }>`

**功能描述**: 使用重置令牌设置新密码。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `password` | `string` | 是 | 新密码 |
| `resetToken` | `string` | 是 | 密码重置令牌 |

**返回值**: 包含更新后的用户对象和可能的错误信息

---

### 5.7 发送密码重置邮件

**接口方法**: `recoverCustomer(email: string): Promise<{ userErrors: UserError[] }>`

**功能描述**: 向指定邮箱发送密码重置链接。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `string` | 是 | 用户注册邮箱 |

**返回值**: 可能的错误信息数组

---

### 5.8 激活用户账户

**接口方法**: `activateCustomer(id: string, input: { password: string; activationToken: string }): Promise<{ customer?: Customer; userErrors: UserError[] }>`

**功能描述**: 激活新用户账户。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | 是 | 用户 ID |
| `input.password` | `string` | 是 | 新密码 |
| `input.activationToken` | `string` | 是 | 激活令牌 |

**返回值**: 包含激活后的用户对象和可能的错误信息

---

## 6. 用户地址 API

### 6.1 创建用户地址

**接口方法**: `createCustomerAddress(accessToken: string, address: MailingAddressInput): Promise<{ customerAddress?: MailingAddress; userErrors: UserError[] }>`

**功能描述**: 为用户创建新的收货地址。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `accessToken` | `string` | 是 | 用户访问令牌 |
| `address` | `MailingAddressInput` | 是 | 地址信息 |

**返回值**: 包含创建的地址对象和可能的错误信息

---

### 6.2 更新用户地址

**接口方法**: `updateCustomerAddress(accessToken: string, addressId: string, address: MailingAddressInput): Promise<{ customerAddress?: MailingAddress; userErrors: UserError[] }>`

**功能描述**: 更新用户的收货地址。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `accessToken` | `string` | 是 | 用户访问令牌 |
| `addressId` | `string` | 是 | 要更新的地址 ID |
| `address` | `MailingAddressInput` | 是 | 新的地址信息 |

**返回值**: 包含更新后的地址对象和可能的错误信息

---

### 6.3 删除用户地址

**接口方法**: `deleteCustomerAddress(accessToken: string, addressId: string): Promise<{ deletedCustomerAddressId?: string; userErrors: UserError[] }>`

**功能描述**: 删除用户的收货地址。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `accessToken` | `string` | 是 | 用户访问令牌 |
| `addressId` | `string` | 是 | 要删除的地址 ID |

**返回值**: 包含被删除的地址 ID 和可能的错误信息

---

### 6.4 设置默认收货地址

**接口方法**: `updateDefaultCustomerAddress(accessToken: string, addressId: string): Promise<{ customer?: Customer; userErrors: UserError[] }>`

**功能描述**: 将指定地址设为用户的默认收货地址。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `accessToken` | `string` | 是 | 用户访问令牌 |
| `addressId` | `string` | 是 | 要设为默认的地址 ID |

**返回值**: 包含更新后的用户对象和可能的错误信息

---

## 7. 订单模块 API

### 7.1 获取用户订单列表

**接口方法**: `getOrders(accessToken: string, first?: number): Promise<OrderConnection>`

**功能描述**: 获取当前用户的订单列表，按时间倒序排列。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `accessToken` | `string` | 是 | 用户访问令牌 |
| `first` | `number` | 否 | 返回的订单数量 |

**返回值**: `Promise<OrderConnection>` - 订单连接对象，包含订单列表和分页信息

---

### 7.2 获取订单详情

**接口方法**: `getOrder(orderId: string): Promise<Order | null>`

**功能描述**: 根据订单 ID 获取订单详情。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `orderId` | `string` | 是 | 订单的唯一标识符 |

**返回值**: `Promise<Order | null>` - 订单详情对象

---

## 8. Checkout 模块 API

### 8.1 创建 Checkout

**接口方法**: `createCheckout(input?: CheckoutCreateInput): Promise<CheckoutResult>`

**功能描述**: 根据购物车信息创建新的 Checkout 对象，用于后续支付流程。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `input.email` | `string` | 否 | 买家邮箱 |
| `input.lineItems` | `CheckoutLineItemInput[]` | 否 | 商品行数组 |
| `input.shippingAddress` | `MailingAddressInput` | 否 | 配送地址 |
| `input.billingAddress` | `MailingAddressInput` | 否 | 账单地址 |
| `input.buyerIdentity` | `CheckoutBuyerIdentityInput` | 否 | 买家身份信息 |
| `input.discountCode` | `string` | 否 | 折扣码 |
| `input.note` | `string` | 否 | 备注 |

**返回值**:

```typescript
interface CheckoutResult {
  checkout?: Checkout              // 创建成功时返回 Checkout 对象
  checkoutUserErrors: CheckoutUserError[]  // 错误信息数组
}
```

---

### 8.2 获取 Checkout 详情

**接口方法**: `getCheckout(checkoutId: string): Promise<Checkout | null>`

**功能描述**: 根据 Checkout ID 获取当前的 Checkout 状态和信息。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `checkoutId` | `string` | 是 | Checkout 的唯一标识符 |

**返回值**: `Promise<Checkout | null>`

---

### 8.3 更新 Checkout 信息

**接口方法**: `updateCheckout(checkoutId: string, input: CheckoutUpdateInput): Promise<CheckoutResult>`

**功能描述**: 更新 Checkout 的买家信息、地址、备注等。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `checkoutId` | `string` | 是 | Checkout ID |
| `input` | `CheckoutUpdateInput` | 是 | 要更新的 Checkout 信息 |

**返回值**: `Promise<CheckoutResult>`

---

### 8.4 向 Checkout 添加商品

**接口方法**: `addCheckoutLines(checkoutId: string, lineItems: CheckoutLineItemInput[]): Promise<CheckoutResult>`

**功能描述**: 向现有的 Checkout 中添加商品行。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `checkoutId` | `string` | 是 | Checkout ID |
| `lineItems` | `CheckoutLineItemInput[]` | 是 | 要添加的商品行数组 |

**返回值**: `Promise<CheckoutResult>`

---

### 8.5 更新 Checkout 商品行

**接口方法**: `updateCheckoutLines(checkoutId: string, lineItems: CheckoutLineItemUpdateInput[]): Promise<CheckoutResult>`

**功能描述**: 更新 Checkout 中已有商品行的数量或变体。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `checkoutId` | `string` | 是 | Checkout ID |
| `lineItems` | `CheckoutLineItemUpdateInput[]` | 是 | 要更新的商品行数组 |

**返回值**: `Promise<CheckoutResult>`

---

### 8.6 移除 Checkout 商品行

**接口方法**: `removeCheckoutLines(checkoutId: string, lineItemIds: string[]): Promise<CheckoutResult>`

**功能描述**: 从 Checkout 中移除指定的商品行。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `checkoutId` | `string` | 是 | Checkout ID |
| `lineItemIds` | `string[]` | 是 | 要移除的商品行 ID 数组 |

**返回值**: `Promise<CheckoutResult>`

---

### 8.7 更新 Checkout 买家身份

**接口方法**: `updateCheckoutBuyerIdentity(checkoutId: string, buyerIdentity: { email?: string; customerAccessToken?: string; countryCode?: string }): Promise<CheckoutResult>`

**功能描述**: 更新 Checkout 的买家身份信息。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `checkoutId` | `string` | 是 | Checkout ID |
| `buyerIdentity` | `object` | 是 | 买家身份信息 |

**返回值**: `Promise<CheckoutResult>`

---

### 8.8 更新 Checkout 配送地址

**接口方法**: `updateCheckoutShippingAddress(checkoutId: string, shippingAddress: MailingAddressInput): Promise<CheckoutResult>`

**功能描述**: 更新 Checkout 的配送地址，触发可用配送方式重新计算。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `checkoutId` | `string` | 是 | Checkout ID |
| `shippingAddress` | `MailingAddressInput` | 是 | 配送地址信息 |

**返回值**: `Promise<CheckoutResult>`

---

### 8.9 获取可用配送方式

**接口方法**: `getAvailableShippingRates(checkoutId: string): Promise<ShippingRate[]>`

**功能描述**: 根据当前的配送地址和商品，获取可用的配送方式列表。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `checkoutId` | `string` | 是 | Checkout ID |

**返回值**: `Promise<ShippingRate[]>` - 可用配送方式数组

**返回字段说明**:

```typescript
interface ShippingRate {
  id?: string
  handle?: string
  title: string              // 配送方式名称，如"标准配送"、"加急配送"
  price: Money              // 配送费用
  estimatedDeliveryTime?: string  // 预计送达时间
  carrierIdentifier?: string  // 承运商标识
  code?: string              // 配送方式代码
  source?: string           // 来源
}
```

---

### 8.10 选择配送方式

**接口方法**: `updateCheckoutShippingLine(checkoutId: string, shippingRateHandle: string): Promise<CheckoutResult>`

**功能描述**: 为 Checkout 选择指定的配送方式。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `checkoutId` | `string` | 是 | Checkout ID |
| `shippingRateHandle` | `string` | 是 | 配送方式的 handle |

**返回值**: `Promise<CheckoutResult>`

---

### 8.11 应用折扣码

**接口方法**: `applyDiscountCode(checkoutId: string, discountCode: string): Promise<CheckoutResult>`

**功能描述**: 为 Checkout 应用折扣码。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `checkoutId` | `string` | 是 | Checkout ID |
| `discountCode` | `string` | 是 | 折扣码 |

**返回值**: `Promise<CheckoutResult>`

---

### 8.12 移除折扣码

**接口方法**: `removeDiscountCode(checkoutId: string): Promise<CheckoutResult>`

**功能描述**: 移除 Checkout 已应用的折扣码。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `checkoutId` | `string` | 是 | Checkout ID |

**返回值**: `Promise<CheckoutResult>`

---

### 8.13 完成 Checkout

**接口方法**: `completeCheckout(checkoutId: string): Promise<{ order?: Order; userErrors: CheckoutUserError[] }>`

**功能描述**: 标记 Checkout 为已完成，创建订单。

**注意**: 在 Shopify 无头模式下，通常是跳转到 Shopify 官方支付页面完成支付，支付完成后 Shopify 会自动创建订单。此方法主要用于 Mock 环境或开发测试。

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `checkoutId` | `string` | 是 | Checkout ID |

**返回值**:

```typescript
{
  order?: Order                    // 创建成功时返回订单对象
  userErrors: CheckoutUserError[]  // 错误信息数组
}
```

---

## 9. 错误处理规范

### 9.1 统一错误格式

所有可能返回错误的接口都采用统一的错误格式：

```typescript
interface UserError {
  field: string[]     // 错误发生的字段路径，如 ['email']
  message: string      // 错误描述信息
  code: ErrorCode       // 错误代码枚举
}
```

### 9.2 Checkout 错误代码枚举

定义在 [`src/types/checkout.ts`](file:///d:/Atemp/cc/ecommerce-store/src/types/checkout.ts)：

| 错误代码 | 说明 |
|----------|------|
| `ALREADY_COMPLETED` | Checkout 已完成 |
| `BAD_DOMAIN` | 域名无效 |
| `CARD_EXPIRED` | 卡片已过期 |
| `CARD_DECLINED` | 卡片被拒绝 |
| `CARD_INVALID` | 卡片无效 |
| `DISCOUNT_CODE_NOT_FOUND` | 折扣码不存在 |
| `DISCOUNT_CODE_NOT_APPLICABLE` | 折扣码不适用 |
| `EMAIL_INVALID` | 邮箱格式无效 |
| `GIFT_CARD_NOT_FOUND` | 礼品卡不存在 |
| `GIFT_CARD_INVALID` | 礼品卡无效 |
| `INSUFFICIENT_STOCK` | 库存不足 |
| `INVALID_PROVINCE` | 省份无效 |
| `INVALID_COUNTRY` | 国家无效 |
| `INVALID_DISCOUNT` | 折扣无效 |
| `MISSING_PAYMENT` | 缺少支付信息 |
| `MISSING_SHIPPING_ADDRESS` | 缺少配送地址 |
| `PAYMENT_AMOUNT_MISMATCH` | 支付金额不匹配 |
| `PAYMENT_FAILED` | 支付失败 |
| `SHIPPING_RATE_NOT_FOUND` | 配送方式不存在 |
| `TAX_REQUIRED` | 需要税费信息 |
| `TOTAL_PRICE_MISMATCH` | 总价不匹配 |
| `UNKNOWN` | 未知错误 |

---

## 10. 服务层封装 (React Query Hooks)

### 10.1 设计原则

服务层使用 TanStack Query 封装所有 API 调用，提供以下优势：

1. **自动缓存**: 智能的数据缓存和重新获取
2. **状态管理**: 统一的加载、错误、成功状态
3. **乐观更新**: 提升用户体验
4. **缓存失效**: 精确控制缓存生命周期

### 10.2 Query Keys 命名规范

采用分层结构设计缓存键：

```typescript
// 商品模块
const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filter: ProductFilter) => [...productKeys.lists(), filter] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (handle: string) => [...productKeys.details(), handle] as const,
  recommendations: (productId: string) =>
    [...productKeys.all, 'recommendations', productId] as const,
}
```

### 10.3 缓存时间配置

| 数据类型 | 缓存时间 | 说明 |
|----------|----------|------|
| 商品列表 | 5 分钟 | 商品数据相对稳定 |
| 商品详情 | 10 分钟 | 详情变更频率低 |
| 商品推荐 | 5 分钟 | 推荐算法可能更新 |
| 商品分类 | 30 分钟 | 分类结构非常稳定 |
| 购物车 | 30 秒 | 需要实时同步 |
| Checkout | 30 秒 | 需要实时同步 |
| 配送方式 | 5 分钟 | 配送价格相对稳定 |
| 用户信息 | 1 分钟 | 用户信息变更频率低 |

---

## 11. 适配器实现

### 11.1 Shopify 适配器

实现文件: [`src/services/adapters/shopify/index.ts`](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/shopify/index.ts)

**特点**:
- 使用 Shopify Storefront API (GraphQL)
- 支持完整的电商功能
- 生产环境默认使用

### 11.2 Mock 适配器

实现文件: [`src/services/adapters/mock/index.ts`](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/mock/index.ts)

**特点**:
- 使用本地模拟数据
- 无需网络连接
- 支持离线开发
- 便于前端独立开发
- 便于测试

### 11.3 适配器工厂

实现文件: [`src/services/adapters/factory.ts`](file:///d:/Atemp/cc/ecommerce-store/src/services/adapters/factory.ts)

根据环境变量自动选择适配器：

```typescript
const ADAPTER_TYPE = process.env.VITE_ADAPTER_TYPE || 'shopify'
```

---

## 12. 相关类型定义

所有类型定义位于 [`src/types/`](file:///d:/Atemp/cc/ecommerce-store/src/types/) 目录：

| 文件 | 说明 |
|------|------|
| [`product.ts`](file:///d:/Atemp/cc/ecommerce-store/src/types/product.ts) | 商品、变体、分类、图片等类型 |
| [`cart.ts`](file:///d:/Atemp/cc/ecommerce-store/src/types/cart.ts) | 购物车相关类型 |
| [`user.ts`](file:///d:/Atemp/cc/ecommerce-store/src/types/user.ts) | 用户、地址、订单相关类型 |
| [`checkout.ts`](file:///d:/Atemp/cc/ecommerce-store/src/types/checkout.ts) | Checkout、配送、折扣相关类型 |
| [`index.ts`](file:///d:/Atemp/cc/ecommerce-store/src/types/index.ts) | 类型导出汇总 |

---

## 13. 最佳实践

### 13.1 API 调用最佳实践

1. **使用服务层 Hooks**: 始终通过服务层 Hooks 调用 API，不要直接调用适配器
2. **合理设置缓存时间**: 根据数据变更频率设置 `staleTime`
3. **错误处理**: 统一处理错误，使用 Toast 提示用户
4. **加载状态**: 显示加载指示器，提升用户体验
5. **预加载**: 对可能导航的页面进行数据预加载

### 13.2 性能优化

1. **图片优化**: 使用 Shopify CDN 优化图片，添加懒加载
2. **代码分割**: 路由级别代码分割
3. **数据缓存**: 充分利用 TanStack Query 缓存
4. **分页加载**: 使用游标分页实现无限滚动

### 13.3 安全规范

1. **不存储敏感信息**: 不将密码、令牌等存储到 localStorage
2. **使用 HTTPS**: 生产环境必须使用 HTTPS
3. **防止 XSS**: React 默认转义，避免使用 `dangerouslySetInnerHTML`
4. **API Token 权限**: Shopify API Token 仅限公开权限

---

## 14. 变更历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-06-04 | 初始版本，包含完整的 API 接口文档 |

