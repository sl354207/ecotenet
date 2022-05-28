import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@utils/promise";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

// console.log(mongoPromise());
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
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
    // secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    newUser: "/auth/new-user", // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log(user);
      if (!user?.role) {
        user.role = "user";
        user.bio = "";
        user.website = "";
        user.socials = [];
        user.denials = 0;
        user.approved = "pending";
      }
      return true;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // if (account?.accessToken) {
      //   token.accessToken = account.accessToken;
      // }
      if (user?.role) {
        token.role = user.role;
      }
      // if (user?.banned) {
      //   token.banned = user.banned;
      // }
      // console.log(token);
      return token;
    },
    async session({ session, token }) {
      // if (token?.accessToken) {
      //   session.accessToken = token.accessToken;
      // }
      if (token?.role) {
        session.user.role = token.role;
      }
      // if (token?.banned) {
      //   session.user.banned = token.banned;
      // }
      // console.log(session);
      return session;
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {
    // signOut({token, session}),
    // updateUser({ user })
  },

  // You can set the theme to 'light', 'dark' or use 'auto' to default to the
  // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
  // theme: "light",

  // Enable debug messages in the console if you are having problems
  debug: true,
});
