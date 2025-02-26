import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If the user is authenticated and tries to access /login, redirect to home
    if (req.nextUrl.pathname.startsWith("/login") && req.nextauth.token) {
      return NextResponse.redirect(new URL("dashboard/home", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);
export const config = {
  matcher: ["/((?!login|api|public).*)"],
};
