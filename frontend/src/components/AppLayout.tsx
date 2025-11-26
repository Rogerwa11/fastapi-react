import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

import { Button } from './Button'

export function AppLayout({ children }: PropsWithChildren) {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/70 px-6 py-4 backdrop-blur">
        <Link to="/" className="text-lg font-semibold tracking-wide text-brand-foreground">
          FastAPI Auth
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex flex-col text-right text-sm text-slate-300">
                <span className="font-semibold text-white">{user.username}</span>
                {user.full_name ? <span className="text-xs text-slate-400">{user.full_name}</span> : null}
              </div>
              <Button variant="ghost" onClick={logout}>
                Sair
              </Button>
            </>
          ) : null}
        </div>
      </header>
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}

