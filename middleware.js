import { NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth';

export function middleware(request) {
  // Protected routes
  const protectedPaths = ['/dashboard', '/create-team'];
  const authPaths = ['/login', '/register'];
  
  const { pathname } = request.nextUrl;

  // Check if it's a protected route
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.includes(pathname)) {
    const token = request.cookies.get('token')?.value;
    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/create-team/:path*', '/login', '/register']
};
