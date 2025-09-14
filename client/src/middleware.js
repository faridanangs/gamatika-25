import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  console.log('Middleware:', { pathname, token: !!token });

  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard/profile', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
