import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const SESSION_KEY = process.env.SESSION_KEY!;
const ENCODED_KEY = new TextEncoder().encode(SESSION_KEY);
const SESSION_TTL_SEC = 60 * 60; // 1 hora

// expira em 1h a partir de agora (para 'expires' se quiser usar data absoluta)
const sessionExpiresAt = () => new Date(Date.now() + SESSION_TTL_SEC * 1000);

export async function encrypt(payload: any) {
  // '1h' => o jose calcula um exp relativo ao iat
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    // Alternativa equivalente:
    // .setExpirationTime(Math.floor(Date.now()/1000) + SESSION_TTL_SEC)
    .sign(ENCODED_KEY);
}

export async function decrypt(session: string | undefined = ''): Promise<any> {
  try {
    const { payload } = await jwtVerify(session, ENCODED_KEY, { algorithms: ['HS256'] });
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<string | null> {
  console.log("Estou pasasndo por aqui")
  const session = cookies().get('session')?.value;
  if (!session) return null;
  const payload = await decrypt(session);
  return (payload as any)?.token ?? null;
}

export async function createSession(token: string) {
  const session = await encrypt({ token });

  cookies().set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',   // se for mesma origem; se for cross-site: 'none' + secure
    path: '/',
    maxAge: SESSION_TTL_SEC, // preferível a 'expires'
    // expires: sessionExpiresAt(), // (alternativa se preferir data absoluta)
  });
}

export async function updateSession() {
  const session = cookies().get('session')?.value;
  const payload = await decrypt(session);
  if (!session || !payload) {
    return new NextResponse(null, { status: 403 });
  }

  // reescreve o cookie para "deslizar" a validade (sliding session)
  cookies().set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SEC,
  });
}

export async function deleteSession() {
  cookies().delete('session');
}
