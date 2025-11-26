export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  full_name?: string
}

