interface SpinnerProps {
  className?: string
}

export function Spinner({ className = 'h-8 w-8' }: SpinnerProps) {
  const composedClassName = [
    'inline-block animate-spin rounded-full border-2 border-slate-100/20 border-t-slate-100',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={composedClassName} aria-hidden />
}

