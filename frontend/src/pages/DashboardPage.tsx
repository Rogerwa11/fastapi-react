import { useState } from 'react'

import { AppLayout } from '@/components/AppLayout'
import { Button } from '@/components/Button'
import { Alert } from '@/components/Alert'
import { Spinner } from '@/components/Spinner'
import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user, refresh } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setError(null)
    try {
      await refresh()
    } catch (err) {
      setError('Não foi possível atualizar seus dados agora.')
    } finally {
      setIsRefreshing(false)
    }
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner />
        </div>
      </AppLayout>
    )
  }

  const createdAt = new Date(user.created_at)

  return (
    <AppLayout>
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-white">Olá, {user.full_name || user.username}!</h1>
            <p className="text-slate-400">Você está autenticado com sucesso.</p>
          </div>
          <Button variant="secondary" onClick={handleRefresh} isLoading={isRefreshing}>
            Atualizar dados
          </Button>
        </header>

        {error ? <Alert variant="error">{error}</Alert> : null}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/20">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Usuário</span>
            <strong className="mt-3 block text-xl font-semibold text-white">{user.username}</strong>
          </article>
          {user.full_name ? (
            <article className="rounded-xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/20">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Nome completo</span>
              <strong className="mt-3 block text-xl font-semibold text-white">{user.full_name}</strong>
            </article>
          ) : null}
          <article className="rounded-xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/20">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Desde</span>
            <strong className="mt-3 block text-xl font-semibold text-white">
              {Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'long',
                timeStyle: 'short',
              }).format(createdAt)}
            </strong>
          </article>
        </div>
      </section>
    </AppLayout>
  )
}

