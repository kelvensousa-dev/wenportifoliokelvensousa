import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Ponto central de autorizacao das rotas.
 *
 * Mudanca importante: /dashboard (o portfolio) virou PUBLICO. Antes, o link
 * "Portfolio" do menu e o "Voltar ao portfolio" do checkout mandavam qualquer
 * visitante para a tela de login — um cliente novo nao conseguia nem ver os
 * produtos. Continuam protegidos: /dashboard/* (area do cliente) e /admin/*.
 *
 * As paginas administrativas ainda conferem o privilegio no servidor
 * (src/lib/require-admin.ts), como segunda camada.
 */
export default withAuth(
  function proxy(req) {
    const { pathname, search } = req.nextUrl;
    const token = req.nextauth.token;

    const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/');
    const isAdminLogin = pathname === '/admin/login';

    if (isAdminLogin) {
      if (token?.isAdmin) return NextResponse.redirect(new URL('/admin', req.url));
      return NextResponse.next();
    }

    if (!token) {
      const signInUrl = new URL(isAdminArea ? '/admin/login' : '/login', req.url);
      signInUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
      return NextResponse.redirect(signInUrl);
    }

    if (isAdminArea && !token.isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // A decisao fica toda na funcao acima (evita o loop em /admin/login).
      authorized: () => true
    }
  }
);

export const config = {
  matcher: ['/dashboard/:path+', '/admin', '/admin/:path*']
};
