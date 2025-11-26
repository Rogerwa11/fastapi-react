import { Link } from 'react-router-dom'

import { AppLayout } from '@/components/AppLayout'

export function NotFoundPage() {
  return (
    <AppLayout>
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-6xl font-bold text-white sm:text-7xl">404</h1>
        <p className="max-w-md text-base text-slate-400 sm:text-lg">
          A página que você procura não foi encontrada ou pode ter sido removida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-brand/90"
        >
          Voltar para a home
        </Link>
      </section>
    </AppLayout>
  )
}

