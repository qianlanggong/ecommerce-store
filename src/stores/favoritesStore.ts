import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS, FAVORITES_LIMIT } from '@/lib/constants'

/**
 * 收藏夹状态接口
 *
 * 管理用户收藏的商品列表，仅存储商品 ID，
 * 商品详情通过商品服务获取。
 *
 * 设计考虑：
 * 1. 仅存储 ID 而非完整商品数据，减少存储占用
 * 2. 设置收藏数量上限，避免无限制增长
 * 3. 持久化到 localStorage，跨会话保持收藏
 * 4. 所有操作都进行参数校验，确保数据合法性
 */
interface FavoritesState {
  favoriteIds: string[]
  addFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
  getFavoritesCount: () => number
}

/**
 * 验证收藏 ID 列表
 *
 * 在从 localStorage 恢复数据时调用，确保数据格式正确。
 * 过滤掉非字符串、空字符串等无效数据。
 *
 * 边界处理：
 * - 如果输入不是数组，返回空数组
 * - 过滤掉非字符串元素
 * - 过滤掉空字符串和纯空白字符串
 *
 * @param ids - 待验证的收藏 ID 列表
 * @returns 验证后的有效 ID 数组
 */
export const validateFavoriteIds = (ids: unknown): string[] => {
  if (!Array.isArray(ids)) return []
  return ids.filter((id): id is string => typeof id === 'string' && id.trim() !== '')
}

/**
 * 收藏夹状态 Store
 *
 * 管理用户收藏的商品，支持添加、删除、切换等操作。
 *
 * 持久化策略：
 * - 完整持久化 favoriteIds 数组
 * - 恢复时进行数据验证，清除无效数据
 *
 * 限制规则：
 * - 最多收藏 FAVORITES_LIMIT 个商品
 * - 重复收藏不重复添加
 * - 所有操作都进行参数校验
 *
 * 注意事项：
 * - 收藏功能是纯客户端实现，不与后端同步
 * - 如需用户账号同步收藏，需要扩展后端接口
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      /**
       * 添加收藏
       *
       * 将商品添加到收藏列表。
       *
       * 边界处理：
       * - 参数无效时静默返回
       * - 已收藏时不重复添加
       * - 达到上限时静默忽略
       *
       * @param productId - 要收藏的商品 ID
       */
      addFavorite: (productId: string) => {
        if (!productId || typeof productId !== 'string' || productId.trim() === '') return
        set((state) => {
          if (state.favoriteIds.includes(productId)) return state
          if (state.favoriteIds.length >= FAVORITES_LIMIT) return state
          return { favoriteIds: [...state.favoriteIds, productId] }
        })
      },

      /**
       * 取消收藏
       *
       * 将商品从收藏列表移除。
       *
       * 边界处理：
       * - 参数无效时静默返回
       * - 不在收藏列表时不报错
       *
       * @param productId - 要取消收藏的商品 ID
       */
      removeFavorite: (productId: string) => {
        if (!productId || typeof productId !== 'string' || productId.trim() === '') return
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== productId),
        }))
      },

      /**
       * 切换收藏状态
       *
       * 如果已收藏则取消，未收藏则添加。
       * 这是最常用的操作方法，用于点击收藏按钮。
       *
       * 边界处理：
       * - 参数无效时静默返回
       * - 达到上限时无法添加，保持当前状态
       *
       * @param productId - 要切换收藏状态的商品 ID
       */
      toggleFavorite: (productId: string) => {
        if (!productId || typeof productId !== 'string' || productId.trim() === '') return
        set((state) => {
          if (state.favoriteIds.includes(productId)) {
            return {
              favoriteIds: state.favoriteIds.filter((id) => id !== productId),
            }
          }
          if (state.favoriteIds.length < FAVORITES_LIMIT) {
            return {
              favoriteIds: [...state.favoriteIds, productId],
            }
          }
          return state
        })
      },

      /**
       * 检查是否已收藏
       *
       * 判断商品是否在收藏列表中。
       *
       * @param productId - 要检查的商品 ID
       * @returns 是否已收藏，参数无效时返回 false
       */
      isFavorite: (productId: string) => {
        if (!productId || typeof productId !== 'string' || productId.trim() === '') return false
        return get().favoriteIds.includes(productId)
      },

      /**
       * 清空所有收藏
       *
       * 清除收藏列表中的所有商品。
       * 谨慎使用，此操作不可撤销。
       */
      clearFavorites: () => {
        set({ favoriteIds: [] })
      },

      /**
       * 获取收藏数量
       *
       * @returns 当前收藏的商品数量
       */
      getFavoritesCount: () => {
        return get().favoriteIds.length
      },
    }),
    {
      name: STORAGE_KEYS.FAVORITES,
      /**
       * 存储恢复回调
       *
       * 从 localStorage 恢复数据后调用，
       * 验证并清理收藏 ID 列表，确保数据有效性。
       */
      onRehydrateStorage: () => (state) => {
        if (state && state.favoriteIds) {
          state.favoriteIds = validateFavoriteIds(state.favoriteIds)
        }
      },
    },
  ),
)
