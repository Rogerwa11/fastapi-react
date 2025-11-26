import { api } from './api'

import type { LoginPayload, RegisterPayload, TokenResponse } from '@/types/auth'
import type { User } from '@/types/user'

export async function loginRequest(payload: LoginPayload) {
  const { data } = await api.post<TokenResponse>('/auth/login', payload)
  return data
}

export async function registerRequest(payload: RegisterPayload) {
  const { data } = await api.post<User>('/auth/register', payload)
  return data
}

export async function fetchCurrentUser() {
  const { data } = await api.get<User>('/auth/me')
  return data
}

