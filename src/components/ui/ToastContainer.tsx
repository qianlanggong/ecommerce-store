import { useToastStore } from '@/stores/toastStore'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type]
        const style = toastStyles[toast.type]

        return (
          <div
            key={toast.id}
            className={cn(
              'animate-fade-in-up shadow-lg flex min-w-[300px] max-w-sm items-center gap-3 rounded-xl border px-4 py-3',
              style,
            )}
            role="alert"
          >
            <Icon size={20} className="flex-shrink-0" />
            <p className="font-body flex-1 text-sm">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current hover:opacity-70 flex-shrink-0 transition-opacity"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ToastContainer
