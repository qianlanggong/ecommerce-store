import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

const variantClasses = {
  text: 'rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-lg',
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const style: React.CSSProperties = {}
  if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width
  if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={cn(
        'animate-pulse bg-muted-foreground/20',
        variantClasses[variant],
        className,
      )}
      style={style}
      aria-hidden="true"
    />
  )
}

interface SkeletonTextProps {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 1, className }: SkeletonTextProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn('h-4', i === lines - 1 && 'w-3/4', className)}
        />
      ))}
    </div>
  )
}

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <Skeleton variant="rectangular" className="aspect-square w-full" />
      <SkeletonText lines={2} />
      <Skeleton variant="text" className="h-5 w-1/2" />
    </div>
  )
}

export default Skeleton
