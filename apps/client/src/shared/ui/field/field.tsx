import * as React from 'react'
import { Field as FieldPrimitive } from '@base-ui/react/field'
import { cn } from '@/shared/lib/utils/class-names'

export const Field = FieldPrimitive.Root

export const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative flex flex-col gap-1.5', className)}
    {...props}
  />
))
FieldGroup.displayName = 'FieldGroup'

export const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
})
FieldLabel.displayName = 'FieldLabel'

export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-[0.8rem] text-muted-foreground', className)}
      {...props}
    />
  )
})
FieldDescription.displayName = 'FieldDescription'

export const FieldSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative my-4 flex items-center justify-center border-t border-border',
      className
    )}
    {...props}
  >
    <span className="absolute bg-white px-2 text-xs text-muted-foreground uppercase">
      {children}
    </span>
  </div>
))
FieldSeparator.displayName = 'FieldSeparator'
