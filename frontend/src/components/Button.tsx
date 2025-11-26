import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  isLoading?: boolean
  icon?: ReactNode
}

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'

const variantClassNames: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white shadow-glow hover:bg-brand/90',
  secondary: 'bg-brand/15 text-brand-foreground hover:bg-brand/25',
  ghost: 'border border-brand/50 bg-transparent text-brand-foreground hover:bg-brand/10',
  danger: 'border border-rose-500/50 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', isLoading = false, icon, children, className = '', disabled, ...rest },
  ref,
) {
  const composedClassName = [baseClass, variantClassNames[variant], className].filter(Boolean).join(' ')

  return (
    <button ref={ref} className={composedClassName} disabled={disabled || isLoading} {...rest}>
      {isLoading ? <Spinner className="h-4 w-4" /> : icon}
      <span>{children}</span>
    </button>
  )
})

