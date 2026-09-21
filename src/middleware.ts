import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Ponto unico de autorizacao da aplicacao.
 *
 * `authorized` devolve sempre `true` de proposito: se devolvesse `!!token`,
 * o next-auth redirecionaria para `pages.signIn` ANTES de a funcao abaixo
 * rodar — e como `/admin/login` tambem casa com o matcher `/admin/:path*`,
 * isso produzia o loop infinito de redirecionamento da versao anterior.
 * Toda a decisao fica concentrada aqui.
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/');
    const isAdminLogin = pathname === '/admin/login';

    // A tela de login administrativo precisa ser publica.
    if (isAdminLogin) {
      if (token?.isAdmin) return NextResponse.redirect(new URL('/admin', req.url));
      return NextResponse.next();
    }

    // Sem sessao: manda para a tela de login correspondente a area.
    if (!token) {
      const signInUrl = new URL(isAdminArea ? '/admin/login' : '/login', req.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Com sessao, mas sem privilegio administrativo.
    if (isAdminArea && !token.isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true
    }
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
