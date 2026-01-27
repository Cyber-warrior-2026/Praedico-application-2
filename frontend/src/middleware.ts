import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Read the HttpOnly Cookie
  const token = request.cookies.get('accessToken')?.value;
  const path = request.nextUrl.pathname;

  // 2. Define Protected Areas
  const isAdminPage = path.startsWith('/admin');
  const isUserPage = path.startsWith('/user');

  // 3. If no token, kick to login
  if (!token && (isAdminPage || isUserPage)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. If token exists, check Role
  if (token) {
    try {
      // Decode payload (Part 2 of JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      // RULE A: Only Admins can visit /admin pages
      if (isAdminPage && role !== 'admin' && role !== 'super_admin') {
         // Redirect unauthorized users to their own dashboard
         return NextResponse.redirect(new URL('/user', request.url));
      }

      // RULE B: Only Users (or Admins acting as users) can visit /user pages
      // (Optional: You might want to let Admins see user pages, remove this if so)
      if (isUserPage && role !== 'user' && role !== 'admin' && role !== 'super_admin') {
         return NextResponse.redirect(new URL('/login', request.url));
      }

    } catch (e) {
      // Token invalid? Force Login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Only run on specific paths to save performance
export const config = {
  matcher: [
    '/admin/:path*', 
    '/user/:path*'
  ],
};