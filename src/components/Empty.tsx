import { cn } from '@/lib/utils'
import { Package } from 'lucide-react'

interface EmptyProps {
  className?: string
  title?: string
  description?: string
}

export default function Empty({ className, title, description }: EmptyProps) {
  return (
    <div
      className={cn(
        'animate-fade-in-up flex h-full flex-col items-center justify-center py-16',
        className,
      )}
    >
      <div className="relative mb-6">
        <div
          className="bg-gold/10 animate-pulse-slow absolute inset-0 rounded-full"
          style={{ transform: 'scale(1.5)' }}
        />
        <div className="bg-gradient-gold shadow-luxury relative flex h-20 w-20 items-center justify-center rounded-full">
          <Package size={40} className="text-cream" />
        </div>
      </div>
      {title && <h3 className="font-display text-charcoal mb-2 text-xl font-semibold">{title}</h3>}
      {description && (
        <p className="font-body text-muted-foreground max-w-sm text-center text-base">
          {description}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-gold">✦</span>
        <span className="font-body text-gold text-sm">LUXURY COLLECTION</span>
        <span className="text-gold">✦</span>
      </div>
    </div>
  )
}
