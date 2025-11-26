import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
const TOKEN_STORAGE_KEY = 'auth_token'

let accessToken: string | null = null

const storage = typeof window !== 'undefined' ? window.localStorage : null
if (storage) {
    accessToken = storage.getItem(TOKEN_STORAGE_KEY)
}

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

export function setAccessToken(token: string | null) {
    accessToken = token
    if (!storage) {
        return
    }
    if (token) {
        storage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
        storage.removeItem(TOKEN_STORAGE_KEY)
    }
}

export function getStoredToken() {
    return storage?.getItem(TOKEN_STORAGE_KEY) ?? null
}

export function clearAuthStorage() {
    setAccessToken(null)
}

