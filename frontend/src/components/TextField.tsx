import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, helperText, id, className = '', ...rest },
  ref,
) {
  const inputId = id ?? rest.name
  const containerClassName = ['flex w-full flex-col gap-2 text-sm', className].filter(Boolean).join(' ')
  const inputClassName = [
    'w-full rounded-lg border border-slate-700/60 bg-slate-900/70 px-3 py-2 text-base text-slate-100 shadow-sm transition placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40',
    error ? 'border-rose-500/70 focus:border-rose-400 focus:ring-rose-400/40' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={containerClassName} htmlFor={inputId}>
      <span className="font-medium text-slate-200">{label}</span>
      <input ref={ref} id={inputId} className={inputClassName} {...rest} />
      {error ? (
        <span className="text-xs text-rose-300" role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span className="text-xs text-slate-400">{helperText}</span>
      ) : null}
    </label>
  )
})

