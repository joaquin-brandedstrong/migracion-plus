import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { DEMO_ROLE_COOKIE } from './lib/demo-session';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PREFIXES = ['/dashboard', '/aprender', '/admin', '/checkout'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeMatch = pathname.match(/^\/(es|en)(?=\/|$)/);
  const locale = localeMatch?.[1] ?? 'es';
  const localeStripped = pathname.replace(/^\/(es|en)(?=\/|$)/, '') || '/';

  // Auth gate: protected routes require a Supabase session cookie OR the demo
  // cookie (set by the one-click demo buttons while there's no DB wired). The
  // actual session validity check is performed in the server layout for the
  // relevant route group; this middleware just short-circuits unauthenticated
  // visitors to the sign-in page so they never see a render of protected UI.
  if (PROTECTED_PREFIXES.some((p) => localeStripped.startsWith(p))) {
    const hasSessionCookie = request.cookies
      .getAll()
      .some((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
    const hasDemoCookie = request.cookies.has(DEMO_ROLE_COOKIE);
    if (!hasSessionCookie && !hasDemoCookie) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/iniciar-sesion`;
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|textures|brand|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
