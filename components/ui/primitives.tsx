import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/lib/utils'

// LABEL
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn('text-xs uppercase tracking-widest text-white/80', className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

// BADGE
function Badge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-none border border-white/15 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-widest text-white/80',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// CARD
function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border border-white/10 bg-black/60', className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 border-b border-white/10', className)} {...props} />
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-sm font-bold uppercase tracking-widest', className)} {...props} />
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />
}

export { Label, Badge, Card, CardHeader, CardTitle, CardContent }
