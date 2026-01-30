import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const path = request.nextUrl.pathname;

  // 1. Exclude public routes
  if (
    path === '/admin/staff-access-portal' || 
    path.startsWith('/user/verify')
  ) {
    return NextResponse.next();
  }

  // 2. Define Protected Areas
  const isAdminPage = path.startsWith('/admin');
  const isUserPage = path.startsWith('/user');

  // 3. If path is protected AND no token -> Kick out
  if (!token && (isAdminPage || isUserPage)) {
    if (isAdminPage) {
      return NextResponse.redirect(new URL('/admin/staff-access-portal', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to Landing Page Login
  }

  // 4. If token exists, check Role AND Status
  if (token) {
    try {
      // Decode the JWT payload manually (Edge compatible)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;
      const isActive = payload.isActive; // <--- Extract status

      // 🛑 BLOCK CHECK: Kick them out if isActive is false
      // We check explicit false to be safe
      if (isActive === false) {
        // Create response to redirect them
        const response = NextResponse.redirect(new URL('/', request.url));
        
        // DESTROY the cookie so they are actually logged out
        response.cookies.delete('accessToken'); 
        response.cookies.delete('user'); // If you store user data in cookies
        
        return response;
      }

      // Role Checks (Your existing logic)
      if (isAdminPage) {
        if (role !== 'admin' && role !== 'super_admin') {
           return NextResponse.redirect(new URL('/user/dashboard', request.url));
        }
      }

      if (isUserPage) {
        if (role !== 'user' && role !== 'admin' && role !== 'super_admin') {
           return NextResponse.redirect(new URL('/', request.url));
        }
      }

    } catch (e) {
      // If token is corrupt, force logout
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('accessToken');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/((?!_next|static|favicon.ico|.*\\..*).*)',
    '/user/((?!_next|static|favicon.ico|.*\\..*).*)',
  ],
};