import type { PropsWithChildren } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { Spinner } from '@/components/Spinner'
import { useAuth } from '@/hooks/useAuth'

interface GuestRouteProps extends PropsWithChildren {
  redirectTo?: string
}

export function GuestRoute({ redirectTo = '/dashboard', children }: GuestRouteProps) {
  const { isAuthenticated, initializing } = useAuth()

  if (initializing) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  if (children) {
    return <>{children}</>
  }

  return <Outlet />
}

