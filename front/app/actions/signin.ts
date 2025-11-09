'use server';

import { createSession } from '@/app/lib/session';

interface UserSignIn {
  username: string;
  password: string;
}

type SignInResult =
  | { ok: true }
  | { ok: false; error: string; status?: number };

/**
 * Login "simples": compara user/pass com valores do .env (ou admin/123456),
 * e cria o cookie de sessão. Não chama backend nenhum.
 */
export async function signIn(data: UserSignIn): Promise<SignInResult> {
  try {
    const expectedUser = process.env.BASIC_USER || 'admin';
    const expectedPass = process.env.BASIC_PASS || '123456';

    const username = (data.username || '').trim();
    const password = data.password || '';

    if (username !== expectedUser || password !== expectedPass) {
      return { ok: false, error: 'Usuário ou senha inválidos', status: 401 };
    }

    // cria um token simples só para marcar a sessão ativa
    const token = `basic:${username}:${Date.now()}`;
    await createSession(token);

    return { ok: true };
  } catch (e: any) {
    return {
      ok: false,
      error: e?.message || 'Erro ao autenticar',
      status: 500,
    };
  }
}
