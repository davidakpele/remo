// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';



// const publicRoutes = ['/login', '/register', '/'];
// const authRoutes = ['/login', '/register'];
// const protectedRoutes = ['/dashboard'];

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get('auth-token')?.value;

//   // Check if route is public
//   const isPublicRoute = publicRoutes.includes(pathname);
//   const isAuthRoute = authRoutes.includes(pathname);
//   const isProtectedRoute = protectedRoutes.some(route => 
//     pathname.startsWith(route)
//   );

//   // Redirect authenticated users away from auth routes
//   if (isAuthRoute && token) {
//     try {
//       await verifyToken(token);
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     } catch {
//       // Token is invalid, allow access to auth routes
//     }
//   }

//   // Protect dashboard routes
//   if (isProtectedRoute && !isPublicRoute) {
//     if (!token) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     try {
//       await verifyToken(token);
//     } catch {
//       const response = NextResponse.redirect(new URL('/login', request.url));
//       response.cookies.delete('auth-token');
//       return response;
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };