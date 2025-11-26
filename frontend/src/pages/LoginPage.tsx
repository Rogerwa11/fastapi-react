import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { Alert } from '@/components/Alert'
import { AuthCard } from '@/components/AuthCard'
import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { Spinner } from '@/components/Spinner'
import { TextField } from '@/components/TextField'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginSchema } from '@/validation/auth'

type LoginFieldErrors = Partial<Record<keyof LoginSchema, string>>

const initialState: LoginSchema = {
  username: '',
  password: '',
}

export function LoginPage() {
  const { login, isAuthenticated, initializing } = useAuth()
  const [form, setForm] = useState<LoginSchema>(initialState)
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof LoginSchema) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setIsSubmitting(true)

    const result = loginSchema.safeParse(form)

    if (!result.success) {
      const { fieldErrors: zodFieldErrors } = result.error.flatten()
      setFieldErrors({
        username: zodFieldErrors.username?.[0],
        password: zodFieldErrors.password?.[0],
      })
      setIsSubmitting(false)
      return
    }

    setFieldErrors({})

    try {
      await login(result.data)
    } catch (err) {
      setFormError('Não foi possível entrar. Verifique suas credenciais e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (initializing) {
    return (
      <AuthLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner />
        </div>
      </AuthLayout>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Bem-vindo de volta"
        subtitle="Faça login para acessar o painel."
        footer={
          <p>
            Ainda não possui conta?{' '}
            <Link to="/register" className="text-brand-foreground hover:text-brand-foreground/80">
              Cadastre-se
            </Link>
          </p>
        }
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {formError ? <Alert variant="error">{formError}</Alert> : null}
          <TextField
            label="Usuário"
            name="username"
            placeholder="seu_usuario"
            autoComplete="username"
            value={form.username}
            onChange={handleChange('username')}
            error={fieldErrors.username}
            required
          />
          <TextField
            label="Senha"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange('password')}
            error={fieldErrors.password}
            required
          />
          <Button type="submit" isLoading={isSubmitting}>
            Entrar
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}

