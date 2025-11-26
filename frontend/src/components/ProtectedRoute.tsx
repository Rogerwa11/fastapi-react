import type { PropsWithChildren } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { Spinner } from '@/components/Spinner'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps extends PropsWithChildren {
  redirectTo?: string
}

export function ProtectedRoute({ redirectTo = '/login', children }: ProtectedRouteProps) {
  const { isAuthenticated, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (children) {
    return <>{children}</>
  }

  return <Outlet />
}

