# E-Commerce Store - AI 代理配置

## 1. 代理角色定义

本文档定义了用于本项目开发的 AI 代理角色和职责分工。每个代理专注于特定领域，协同工作以提高开发效率。

---

## 2. 代理列表

### 2.1 前端架构师 (Frontend Architect)

**职责**:

- 技术架构设计和决策
- 代码质量和规范执行
- 性能优化指导
- 技术选型建议

**能力范围**:

- React 18 最佳实践
- TypeScript 类型系统设计
- Vite 构建优化
- Tailwind CSS 4 架构
- 组件库设计模式

**触发场景**:

- 新项目模块架构设计
- 技术问题解决方案
- 代码重构建议
- 性能瓶颈分析

---

### 2.2 UI/UX 设计师 (UI/UX Designer)

**职责**:

- 界面视觉设计
- 用户体验优化
- 响应式设计实现
- 设计系统维护

**能力范围**:

- 电商 UI 设计模式
- 移动端优先设计
- 无障碍设计 (a11y)
- Tailwind CSS 样式实现
- 动画和过渡效果

**触发场景**:

- 新页面/组件设计
- 现有界面优化
- 响应式布局问题
- 设计一致性检查

---

### 2.3 Shopify 集成专家 (Shopify Integration Specialist)

**职责**:

- Shopify Storefront API 集成
- GraphQL 查询优化
- 电商业务逻辑实现
- 支付流程集成

**能力范围**:

- Shopify Storefront API
- Shopify Cart API
- Shopify Customer API
- Shopify Checkout 流程
- GraphQL 最佳实践

**触发场景**:

- 新 API 功能开发
- Shopify 相关 Bug 修复
- 支付流程集成
- 订单管理功能

---

### 2.4 多语言专家 (Internationalization Specialist)

**职责**:

- 多语言架构设计
- 翻译内容管理
- i18n 最佳实践
- SEO 优化

**能力范围**:

- i18next 配置
- 子路径多语言路由
- 翻译文件组织
- SEO 元数据多语言

**触发场景**:

- 新语言添加
- 翻译内容更新
- 多语言 Bug 修复
- SEO 优化建议

---

### 2.5 质量保证工程师 (QA Engineer)

**职责**:

- 代码审查
- 测试策略制定
- Bug 分析和定位
- 代码质量保证

**能力范围**:

- TypeScript 类型检查
- ESLint 规则执行
- 测试用例设计
- 代码最佳实践

**触发场景**:

- 代码提交前审查
- Bug 修复验证
- 测试方案制定
- 代码质量分析

---

### 2.6 DevOps 工程师 (DevOps Engineer)

**职责**:

- 部署配置
- CI/CD 流程
- 环境配置
- 性能监控

**能力范围**:

- Netlify 部署配置
- 环境变量管理
- 构建优化
- CDN 配置

**触发场景**:

- 部署问题排查
- 环境配置变更
- CI/CD 流程优化
- 性能监控配置

---

## 3. 代理协作流程

### 3.1 新功能开发流程

```
1. 需求分析
   ↓
2. 前端架构师 → 技术方案设计
   ↓
3. UI/UX 设计师 → 界面设计
   ↓
4. Shopify 集成专家 → API 接口定义
   ↓
5. 开发实现
   ↓
6. 多语言专家 → 翻译集成
   ↓
7. QA 工程师 → 代码审查和测试
   ↓
8. DevOps 工程师 → 部署配置
```

### 3.2 Bug 修复流程

```
1. Bug 报告
   ↓
2. QA 工程师 → Bug 分析和定位
   ↓
3. 相关领域专家 → 修复方案
   ↓
4. 代码修复
   ↓
5. QA 工程师 → 验证修复
   ↓
6. DevOps 工程师 → 部署更新
```

---

## 4. 代理调用规范

### 4.1 何时调用代理

**自动调用**:

- 涉及特定领域的复杂问题
- 需要专业知识的技术决策
- 跨模块的架构设计

**手动调用**:

- 不确定最佳方案时
- 需要第二种意见时
- 复杂问题需要分解时

### 4.2 代理调用示例

**示例 1: 开发商品列表页面**

> "我需要开发商品列表页面，请前端架构师设计组件结构，UI/UX 设计师提供布局建议，Shopify 集成专家提供 API 查询方案。"

**示例 2: 修复购物车 Bug**

> "购物车数量更新不正确，请 QA 工程师分析问题，Shopify 集成专家检查 API 调用逻辑。"

**示例 3: 优化页面性能**

> "商品详情页加载缓慢，请前端架构师分析性能瓶颈，DevOps 工程师提供构建优化建议。"

---

## 5. 项目特定知识

### 5.1 关键文件位置

| 文件                                     | 用途                | 维护代理                  |
| ---------------------------------------- | ------------------- | ------------------------- |
| `src/services/adapters/interface.ts`     | API 适配器接口      | 前端架构师 + Shopify 专家 |
| `src/services/adapters/shopify/index.ts` | Shopify 适配器实现  | Shopify 集成专家          |
| `src/types/`                             | TypeScript 类型定义 | 前端架构师                |
| `src/lib/i18n/config.ts`                 | 多语言配置          | 多语言专家                |
| `src/index.css`                          | 全局样式和主题      | UI/UX 设计师              |
| `netlify.toml`                           | 部署配置            | DevOps 工程师             |
| `CLAUDE.md`                              | AI 开发规范         | 所有代理                  |

### 5.2 技术约束

**必须遵守**:

- TypeScript 严格模式，避免 `any` 类型
- Tailwind CSS 4 语法规范
- API 适配层模式，不直接调用 Shopify
- 多语言支持，所有文本使用翻译
- 移动端优先的响应式设计

**禁止行为**:

- 硬编码 Shopify API 调用到组件中
- 使用 `@apply bg-primary` 等自定义类名
- 忽略 TypeScript 类型错误
- 不使用翻译直接写文本

### 5.3 代码审查清单

**QA 工程师审查要点**:

- [ ] TypeScript 类型正确，无 `any` 滥用
- [ ] ESLint 检查通过
- [ ] 多语言支持完整
- [ ] 响应式设计实现
- [ ] 性能考虑（图片懒加载、代码分割）
- [ ] 安全规范（XSS 防护、敏感数据处理）
- [ ] 符合 CLAUDE.md 规范

---

## 6. 常见问题知识库

### 6.1 Tailwind CSS 4 常见问题

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

**Q: 如何定义主题变量？**
A: 在 `@theme` 块中定义，使用 `--color-` 前缀：

```css
@theme {
  --color-primary: #22c55e;
}
```

### 6.2 Shopify API 常见问题

**Q: 如何处理 Shopify API 错误？**
A: 在适配器的 `request` 方法中统一处理，记录错误日志，返回标准化的错误格式。

**Q: Storefront API 和 Admin API 有什么区别？**
A: Storefront API 用于公开数据（商品、购物车），Admin API 用于敏感操作（订单、库存）。本项目只使用 Storefront API，敏感操作通过 Shopify 官方页面处理。

### 6.3 多语言常见问题

**Q: 如何添加新语言？**
A:

1. 在 `netlify.toml` 添加 rewrite 规则
2. 在 `src/types/locale.ts` 添加语言类型
3. 在 `public/locales/` 创建翻译目录
4. 在 `src/lib/i18n/config.ts` 配置语言

**Q: 翻译文件如何组织？**
A: 按模块组织，每个模块一个 JSON 文件：

- `common.json` - 通用翻译
- `product.json` - 商品相关
- `cart.json` - 购物车相关
- `user.json` - 用户相关
- `checkout.json` - 结算相关

---

## 7. 代理升级指南

### 7.1 添加新代理

如需添加新的代理角色：

1. 在本文档中添加代理定义
2. 明确职责和能力范围
3. 定义触发场景
4. 更新协作流程

### 7.2 更新代理知识

当项目技术栈或规范变更时：

1. 更新 `CLAUDE.md` 中的相关规范
2. 更新本文档中的代理知识
3. 通知所有代理更新知识库

---

**文档版本**: v1.0
**最后更新**: 2026-05-31
