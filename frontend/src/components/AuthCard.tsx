import type { PropsWithChildren, ReactNode } from 'react'

interface AuthCardProps extends PropsWithChildren {
  title: string
  subtitle?: string
  footer?: ReactNode
}

export function AuthCard({ title, subtitle, footer, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-8 shadow-glow backdrop-blur">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
      </header>
      <div className="mt-6 space-y-4">{children}</div>
      {footer ? <footer className="mt-6 text-center text-sm text-slate-400">{footer}</footer> : null}
    </div>
  )
}

