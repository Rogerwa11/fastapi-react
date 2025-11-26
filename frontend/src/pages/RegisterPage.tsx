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
import { registerSchema, type RegisterSchema } from '@/validation/auth'

type RegisterFieldErrors = Partial<Record<keyof RegisterSchema, string>>

const initialState: RegisterSchema = {
  username: '',
  full_name: undefined,
  password: '',
  confirmPassword: '',
}

export function RegisterPage() {
  const { register, isAuthenticated, initializing } = useAuth()
  const [form, setForm] = useState<RegisterSchema>(initialState)
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof RegisterSchema) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      [field]: field === 'full_name' ? (value === '' ? undefined : value) : value,
    }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setIsSubmitting(true)

    const result = registerSchema.safeParse(form)

    if (!result.success) {
      const { fieldErrors: zodFieldErrors } = result.error.flatten()
      setFieldErrors({
        username: zodFieldErrors.username?.[0],
        full_name: zodFieldErrors.full_name?.[0],
        password: zodFieldErrors.password?.[0],
        confirmPassword: zodFieldErrors.confirmPassword?.[0],
      })
      setIsSubmitting(false)
      return
    }

    setFieldErrors({})

    try {
      const { username, password, full_name } = result.data
      await register({
        username,
        password,
        full_name,
      })
    } catch (err) {
      setFormError('Não foi possível criar a conta. Tente novamente.')
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
        title="Crie sua conta"
        subtitle="Cadastre-se para começar a usar o painel."
        footer={
          <p>
            Já possui conta?{' '}
            <Link to="/login" className="text-brand-foreground hover:text-brand-foreground/80">
              Entre aqui
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
            label="Nome completo"
            name="full_name"
            placeholder="Seu Nome"
            autoComplete="name"
            value={form.full_name ?? ''}
            onChange={handleChange('full_name')}
            error={fieldErrors.full_name}
          />
          <TextField
            label="Senha"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange('password')}
            error={fieldErrors.password}
            required
          />
          <TextField
            label="Confirmar senha"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={fieldErrors.confirmPassword}
            required
          />
          <Button type="submit" isLoading={isSubmitting}>
            Criar conta
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
