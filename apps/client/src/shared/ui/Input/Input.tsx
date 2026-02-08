import { cn } from '@/shared/lib/utils/class-names'
import React, { ReactNode } from 'react'
import { FieldValues, Control, Path, useController } from 'react-hook-form'

interface MyInputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<T>
  name: Path<T>
  search?: ReactNode
}

const InputInner = <T extends FieldValues>(
  { className, control, name, ...props }: MyInputProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name })

  return (
    <div className="w-full relative">
      <input
        {...field}
        {...props}
        ref={ref}
        type={props.type || 'text'}
        className={cn(
          'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950',
          'placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  )
}

export const Input = React.forwardRef(InputInner) as <T extends FieldValues>(
  props: MyInputProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => React.ReactElement
