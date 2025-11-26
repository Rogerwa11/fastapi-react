import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Informe seu usuário.')
    .min(3, 'O usuário deve ter pelo menos 3 caracteres.')
    .max(50, 'O usuário deve ter no máximo 50 caracteres.'),
  password: z
    .string()
    .min(1, 'Informe sua senha.')
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .max(128, 'A senha deve ter no máximo 128 caracteres.'),
})

export const registerSchema = loginSchema
  .extend({
    full_name: z
      .string()
      .trim()
      .max(100, 'O nome deve ter no máximo 100 caracteres.')
      .optional()
      .transform((value) => (value && value.length > 0 ? value : undefined)),
    confirmPassword: z
      .string()
      .min(1, 'Confirme sua senha.')
      .min(6, 'A senha deve ter pelo menos 6 caracteres.')
      .max(128, 'A senha deve ter no máximo 128 caracteres.'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'As senhas não conferem.',
      })
    }
  })

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>

