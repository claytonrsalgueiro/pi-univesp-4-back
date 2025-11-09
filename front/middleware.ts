import { NextResponse, type NextRequest } from 'next/server';
import { decrypt } from '@/app/lib/session';

const protectedRoutes = ['/meteo', '/meteo/graficos'];
const publicRoutes = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Evita loops causados por prefetch do Next.js
  const purpose = request.headers.get('purpose');
  if (purpose === 'prefetch') {
    return NextResponse.next();
  }

  // Só intercepta GET/HEAD
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return NextResponse.next();
  }

  const isProtectedRoute =
    protectedRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'));
  const isPublicRoute =
    publicRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'));

  const raw = request.cookies.get('session')?.value;
  const payload = raw ? await decrypt(raw) : null;
  const hasSession = Boolean((payload as any)?.token);

  // Caso especial: /login com querys de registro
  if (isPublicRoute && pathname !== '/login') {
    const register = searchParams.get('registerAproved');
    const identifier = searchParams.get('identifier');
    if (register && identifier) {
      return NextResponse.redirect(new URL('/validar-registro', request.url));
    }
  }

  // Já logado indo para /login → /meteo
  if (pathname === '/login' && hasSession) {
    return NextResponse.redirect(new URL('/meteo', request.url));
  }

  // Protegida sem sessão → /login
  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Prossegue
  const res = NextResponse.next();

  // Sliding session nas rotas protegidas
  if (isProtectedRoute && raw && hasSession) {
    res.cookies.set('session', raw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1h
    });
  }

  return res;
}

// Exclui /api, estáticos, favicon, icon, .well-known, sitemap e robots
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|sitemap.xml|robots.txt|\\.well-known).*)',
  ],
};
