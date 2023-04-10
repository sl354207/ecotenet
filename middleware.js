import { importSPKI, jwtVerify } from "jose";
import { withAuth } from "next-auth/middleware";
// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware

// const TEST_SECRET =
//   "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2";

// const key = createSecretKey(TEST_SECRET, "utf-8");

const alg = "RS256";

export default withAuth({
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    // secret: spki,
    // // The maximum age of the NextAuth.js issued JWT in seconds.
    // // Defaults to `session.maxAge`.
    // maxAge: 60 * 60 * 24 * 30,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ token = {}, secret, maxAge = DEFAULT_MAX_AGE }) => {
    //   const jwt = await new SignJWT(token)
    //     .setProtectedHeader({ alg: "HS256" })
    //     .setIssuedAt()
    //     .setExpirationTime(now() + maxAge)
    //     .setJti(randomUUID())
    //     .sign(secret);

    //   console.log(jwt);

    //   return jwt;
    // },
    decode: async ({ token }) => {
      if (!token) return null;
      const publicKey = await importSPKI(process.env.NEXTAUTH_SECRET, alg);

      const { payload } = await jwtVerify(token, publicKey, {
        clockTolerance: 15,
      });
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
