import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

let toastIdCounter = 0

function generateToastId(): string {
  toastIdCounter += 1
  return `toast-${Date.now()}-${toastIdCounter}`
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (message, type = 'info', duration = 3000) => {
    const id = generateToastId()
    const toast: Toast = { id, message, type, duration }

    set((state) => ({ toasts: [...state.toasts, toast] }))

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      }, duration)
    }
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },

  clearToasts: () => {
    set({ toasts: [] })
  },
}))

export function useToast() {
  const { addToast, removeToast, clearToasts } = useToastStore()

  return {
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
    warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
    remove: removeToast,
    clear: clearToasts,
  }
}
