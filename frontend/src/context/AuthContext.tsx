import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import type { AxiosError } from 'axios'

import { clearAuthStorage, getStoredToken, setAccessToken } from '@/services/api'
import { fetchCurrentUser, loginRequest, registerRequest } from '@/services/auth'
import type { LoginPayload, RegisterPayload } from '@/types/auth'
import type { User } from '@/types/user'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  initializing: boolean
  login(payload: LoginPayload): Promise<void>
  register(payload: RegisterPayload): Promise<void>
  logout(): void
  refresh(): Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(true)

  const loadUser = useCallback(async () => {
    try {
      const me = await fetchCurrentUser()
      setUser(me)
    } catch (error) {
      const axiosError = error as AxiosError
      const status = axiosError.response?.status
      if (status === 401) {
        clearAuthStorage()
        setUser(null)
        setToken(null)
      }
      throw error
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!token) {
      return
    }
    await loadUser()
  }, [loadUser, token])

  useEffect(() => {
    const storedToken = getStoredToken()
    if (storedToken) {
      setAccessToken(storedToken)
      setToken(storedToken)
      loadUser()
        .catch(() => undefined)
        .finally(() => setInitializing(false))
    } else {
      setInitializing(false)
    }
  }, [loadUser])

  const login = useCallback(
    async (payload: LoginPayload) => {
      const { access_token: accessToken } = await loginRequest(payload)
      setAccessToken(accessToken)
      setToken(accessToken)
      await loadUser()
    },
    [loadUser],
  )

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await registerRequest(payload)
      await login({ username: payload.username, password: payload.password })
    },
    [login],
  )

  const logout = useCallback(() => {
    clearAuthStorage()
    setUser(null)
    setToken(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      initializing,
      login,
      register,
      logout,
      refresh,
    }),
    [user, token, initializing, login, register, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider.')
  }
  return context
}

