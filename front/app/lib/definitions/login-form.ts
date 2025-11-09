import { z } from 'zod';

export const loginFormSchema = z
    .object({
        username: z.string().min(1, { message: 'Usuário é obrigatório.' }).trim(),
        password: z.string().min(1, { message: 'Senha é obrigatória.' }).trim()
    })
    .required();

export type FormState =
    | {
          errors?: {
              username?: string[];
              password?: string[];
          };
          message?: string;
      }
    | undefined;

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
