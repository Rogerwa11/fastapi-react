import type { PropsWithChildren } from 'react'

type AlertVariant = 'info' | 'error' | 'success'

interface AlertProps extends PropsWithChildren {
  variant?: AlertVariant
}

const variantClassNames: Record<AlertVariant, string> = {
  info: 'border-brand/40 bg-brand/10 text-brand-foreground',
  error: 'border-rose-500/50 bg-rose-500/10 text-rose-100',
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
}

export function Alert({ variant = 'info', children }: AlertProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${variantClassNames[variant]}`.trim()}>
      {children}
    </div>
  )
}

