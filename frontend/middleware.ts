import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

export function middleware(request: NextRequest) {
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for authentication token in cookies or headers
    const token = request.cookies.get('access_token') ||
                  request.headers.get('Authorization')?.replace('Bearer ', '') ||
                  localStorage.getItem('access_token'); // This won't work in middleware, but keeping for reference

    // For demo purposes, checking localStorage would need to be done client-side
    // In a real implementation, you'd validate the token on the server

    if (!token) {
      // Redirect to login page if no token is found
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Optionally validate the token here by calling an API endpoint
    // or by decoding it if it's a JWT
  }

  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};