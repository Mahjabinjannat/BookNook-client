// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/lib/auth";

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Validate the actual Better Auth session
//   const session = await auth.api.getSession({
//     headers: request.headers,
//   });

//   const isLoggedIn = !!session?.user;

//   // PRIVATE ROUTES
//   const privateRoutes = ["/add-book", "/my-books", "/my-borrows", "/profile"];

//   // AUTHENTICATION ROUTES
//   const authRoutes = ["/signIn", "/signUp"];

//   const isPrivateRoute = privateRoutes.some(
//     (route) => pathname === route || pathname.startsWith(`${route}/`),
//   );

//   const isAuthRoute = authRoutes.includes(pathname);

//   // 1. Not logged in -> redirect to sign in
//   if (isPrivateRoute && !isLoggedIn) {
//     const signInUrl = new URL("/signIn", request.url);

//     // Remember the originally requested page
//     signInUrl.searchParams.set(
//       "callbackUrl",
//       request.nextUrl.pathname + request.nextUrl.search,
//     );

//     return NextResponse.redirect(signInUrl);
//   }

//   // 2. Already logged in -> prevent sign in/sign up
//   if (isAuthRoute && isLoggedIn) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // 3. Otherwise allow access
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/add-book/:path*",
//     "/my-books/:path*",
//     "/my-borrows/:path*",
//     "/profile/:path*",
//     "/signIn",
//     "/signUp",
//   ],
// };

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Validate the actual Better Auth session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isLoggedIn = Boolean(session?.user);

  // Private routes
  const privateRoutes = ["/add-book", "/my-books", "/my-borrows", "/profile"];

  const isPrivatePage = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // /books is PUBLIC
  // /books/[id] is PRIVATE
  const isBookDetailsPage = pathname.startsWith("/books/");

  // Authentication pages
  const isAuthPage = pathname === "/signIn" || pathname === "/signUp";

  // Redirect unauthenticated users to sign-in
  if ((isPrivatePage || isBookDetailsPage) && !isLoggedIn) {
    const signInUrl = new URL("/signIn", request.url);

    signInUrl.searchParams.set("callbackUrl", pathname + search);

    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add-book/:path*",
    "/my-books/:path*",
    "/my-borrows/:path*",
    "/profile/:path*",
    "/books/:path*",
    "/signIn",
    "/signUp",
  ],
};
