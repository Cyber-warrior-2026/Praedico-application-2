import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const path = request.nextUrl.pathname;

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
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. If token exists, check Role
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

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