// import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware";

// export function middleware(request) {
//   if (request.nextUrl.pathname.startsWith("/about")) {
//     return NextResponse.rewrite(new URL("/about-2", request.url))
//   }

//   if (request.nextUrl.pathname.startsWith("/dashboard")) {
//     return NextResponse.rewrite(new URL("/dashboard/user", request.url))
//   }
// }

// export default withAuth({
//   callbacks: {
//     authorized: ({ token }) => token?.role === "admin",
//   },
// });

// import { withAuth } from "next-auth/middleware"

// export default withAuth(
//   // `withAuth` augments your `Request` with the user's token.
//   function middleware(req) {
//     console.log(req.nextauth.token)
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => token?.role === "admin",
//     },
//   }
// )

// export const config = { matcher: ["/admin"] }

// import { withAuth } from "next-auth/middleware"

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // `/admin` requires admin role
      if (
        req.nextUrl.pathname.startsWith("/admin") ||
        req.nextUrl.pathname.startsWith("/api/admin")
      ) {
        return token?.role === "admin";
      }
      // `/me` only requires the user to be logged in
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/dashboard/:path*"],
};
