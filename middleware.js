import { importSPKI, jwtVerify } from "jose";
import { withAuth } from "next-auth/middleware";
// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware

export default withAuth({
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    // secret: spki,
    // // The maximum age of the NextAuth.js issued JWT in seconds.
    // // Defaults to `session.maxAge`.
    // maxAge: 60 * 60 * 24 * 30,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.

    decode: async ({ token }) => {
      if (!token) return null;
      const publicKey = await importSPKI(process.env.NEXTAUTH_SECRET, "RS512");

      const { payload } = await jwtVerify(token, publicKey, {
        issuer: "https://www.ecotenet.org",
        audience: [
          "https://www.ecotenet.org",
          "https://ecotenet.org",
          "https://www.forum.ecotenet.org",
          "https://forum.ecotenet.org",
        ],
        clockTolerance: 15,
      });

      // const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
      // const { payload } = await jwtVerify(token, secret, {
      //   issuer: "https://www.ecotenet.org",
      //   audience: [
      //     "https://www.ecotenet.org",
      //     "https://ecotenet.org",
      //     "https://www.forum.ecotenet.org",
      //     "https://forum.ecotenet.org",
      //   ],
      // });

      // console.log(protectedHeader);
      // console.log(payload);
      return payload;
    },
  },
  callbacks: {
    authorized({ req, token }) {
      // `/admin` requires admin role
      if (
        req.nextUrl.pathname.startsWith("/admin") ||
        req.nextUrl.pathname.startsWith("/api/admin")
      ) {
        return token?.role === "admin";
      }
      // `/dashboard` only requires the user to be logged in
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/api/dashboard/:path*",
  ],
};
