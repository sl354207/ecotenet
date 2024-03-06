import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { clientPromise } from "@utils/mongodb/mongoPromise";
import { validEmail, validName } from "@utils/validationHelpers";
import { randomBytes, randomUUID } from "crypto";
import { SignJWT, importPKCS8, importSPKI, jwtVerify } from "jose";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer";

let cookieOptions;
let cookiePrefix;
if (process.env.VERCEL_ENV === "production") {
  cookiePrefix = "__Secure-";
  cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: true,
    domain: "ecotenet.org",
  };
} else {
  cookiePrefix = process.env.VERCEL_ENV === "preview" ? "__Secure-" : "";
  cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.VERCEL_ENV === "preview" ? true : false,
  };
}

// console.log(hostName);
// console.log(useSecureCookies);

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

const now = () => (Date.now() / 1000) | 0;

export const authOptions = {
  // Configure one or more authentication providers
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 5 * 60,
      generateVerificationToken: async () => {
        // const token = await generateAuthtoken();
        const token = await (async function () {
          return randomBytes(4).toString("hex");
        })();
        return token;
      },
      async sendVerificationRequest(params) {
        const { identifier, provider, token, theme } = params;

        const url = new URL(params.url);
        url.searchParams.delete("token"); // uncomment if you want the user to type this manually
        const signInURL = new URL(
          `/auth/email?${url.searchParams}`,
          url.origin
        );
        const escapedHost = signInURL.host.replace(/\./g, "&#8203;.");

        const result = await createTransport(process.env.EMAIL_SERVER).sendMail(
          {
            to: identifier,
            from: {
              name: "Ecotenet",
              address: provider.from,
            },
            subject: `Sign in to ${signInURL.host}`,
            text: `Sign in on ${signInURL} using the verification code: ${token}`,
            html: `<body style="background: "#f9f9f9";">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: "#444444";">
                    <strong>${escapedHost}</strong>
                  </td>
                </tr>
              </table>
              <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: "#ffffff"; max-width: 600px; margin: auto; border-radius: 10px;">
                <tr>
                  <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: "#444444";">
                    Sign in by entering the following code:
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 24px; font-family: Helvetica, Arial, sans-serif; color: "#444444";">
                      Verification Code: <strong>${token}</strong>
                    </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: "#444444";">
                    If you did not request this email you can safely ignore it.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: "#444444";">
                    This is a no-reply email address so please do not respond to this email. If you need to contact us email us at info@ecotenet.org
                  </td>
                </tr>
              </table>

            </body>`,
          }
        );
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  // secret: process.env.NEXTAUTH_SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    // secret: secret,
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    encode: async ({ token = {}, maxAge = DEFAULT_MAX_AGE }) => {
      const privateKey = await importPKCS8(process.env.JWT_PRIVATE, "RS512");

      const jwt = await new SignJWT(token)
        .setProtectedHeader({ alg: "RS512", typ: "JWT" })
        .setIssuedAt()
        .setIssuer("https://www.ecotenet.org")
        .setAudience([
          "https://www.ecotenet.org",
          "https://ecotenet.org",
          "https://www.forum.ecotenet.org",
          "https://forum.ecotenet.org",
        ])
        .setExpirationTime(now() + maxAge)
        .setJti(randomUUID())
        .sign(privateKey);

      // const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

      // const jwt = await new SignJWT(token)
      //   .setProtectedHeader({ alg: "HS512", typ: "JWT" })
      //   .setIssuedAt()
      //   .setIssuer("https://www.ecotenet.org")
      //   .setAudience([
      //     "https://www.ecotenet.org",
      //     "https://ecotenet.org",
      //     "https://www.forum.ecotenet.org",
      //     "https://forum.ecotenet.org",
      //   ])
      //   .setExpirationTime(now() + maxAge)
      //   .setJti(randomUUID())
      //   .sign(secret);

      // console.log(jwt);

      return jwt;
    },
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

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: "/auth/signin", // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    newUser: "/auth/new-user", // If set, new users will be directed here on first sign in
  },

  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: cookieOptions,
    },
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!user?.role) {
        user.role = "user";
        user.bio = "";
        user.website = "";
        user.socials = [];
        user.denials = 0;
        user.approved = "pending";
        user.blocked = false;
      }
      return true;
    },
    async jwt({ token, trigger, session, user, account, profile, isNewUser }) {
      if (user?.role) {
        token.role = user.role;
      }
      if (trigger === "update" && session?.name) {
        if (
          Object.keys(session).length === 1 &&
          Object.keys(session[0] === "name" && validName(session.name))
        ) {
          token.name = session.name;
        }
        // console.log(session);
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }

      // console.log(session);
      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   // Allows relative callback URLs
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl;
    // },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {
    // signOut({token, session}),
    // updateUser({ user })
  },

  // You can set the theme to 'light', 'dark' or use 'auto' to default to the
  // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
  // theme: {
  //   colorScheme: "dark", // "auto" | "dark" | "light"
  //   brandColor: "#94c9ff", // Hex color code
  //   logo: "", // Absolute URL to image
  // },

  // Enable debug messages in the console if you are having problems
  debug: false,
};

export default async function auth(req, res) {
  if (req.method === "HEAD") {
    return res.status(200);
  }

  if (
    req.query.nextauth.includes("signin") &&
    req.query.nextauth.includes("email") &&
    req.query.nextauth.length === 2 &&
    req.method === "POST"
  ) {
    const email = req.body.email;

    if (!validEmail(email)) {
      // throw new Error("Invalid Email");
      return res.status(403).json({ msg: "Invalid Email" });
    } else {
      return await NextAuth(req, res, authOptions);
    }
  } else {
    return await NextAuth(req, res, authOptions);
  }
}
