import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@utils/mongodb/mongoPromise";
import { randomBytes } from "crypto";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer";

// console.log(mongoPromise());

export default async function auth(req, res) {
  if (req.method === "HEAD") {
    return res.status(200);
  }
  return await NextAuth(req, res, {
    adapter: MongoDBAdapter(clientPromise),
    // providers: [
    //   EmailProvider({
    //     server: process.env.EMAIL_SERVER,
    //     from: process.env.EMAIL_FROM,
    //   }),
    // ],
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

          const result = await createTransport(
            "smtp://projectprotectnature@gmail.com:bvyiapwmnivgxomf@smtp.gmail.com:587"
          ).sendMail({
            to: identifier,
            from: provider.from,
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
                    Sign in as <strong>${identifier}</strong>
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
              </table>

            </body>`,
          });
          const failed = result.rejected.concat(result.pending).filter(Boolean);
          if (failed.length) {
            throw new Error(
              `Email(s) (${failed.join(", ")}) could not be sent`
            );
          }
        },
        // sendVerificationRequest: ({
        //   identifier: email,
        //   url,
        //   token,

        //   provider,
        // }) => {
        //   return new Promise((resolve, reject) => {
        //     const { server, from } = provider;
        //     console.log(server);
        //     // Strip protocol from URL and use domain as site name
        //     // const site = baseUrl.replace(/^https?:\/\//, "");
        //     const { host } = new URL(url);

        //     nodemailer.createTransport(server).sendMail(
        //       {
        //         to: email,
        //         from,
        //         subject: `Sign in to Ecotenet`,
        //         // subject: `Sign in to ${host}`,
        //         text: text({ url, host, token, email }),
        //         html: html({ url, host, token, email }),
        //       },
        //       (error) => {
        //         if (error) {
        //           // logger.error('SEND_VERIFICATION_EMAIL_ERROR', email, error);
        //           // console.error("SEND_VERIFICATION_EMAIL_ERROR", email, error);
        //           return reject(
        //             new Error(`SEND_VERIFICATION_EMAIL_ERROR ${error}`)
        //           );
        //         }
        //         return resolve();
        //       }
        //     );
        //     function html({ url, host, token, email }) {
        //       // Insert invisible space into domains and email address to prevent both the
        //       // email address and the domain from being turned into a hyperlink by email
        //       // clients like Outlook and Apple mail, as this is confusing because it seems
        //       // like they are supposed to click on their email address to sign in.
        //       const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
        //       const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;

        //       // Some simple styling options
        //       const backgroundColor = "#f9f9f9";
        //       const textColor = "#444444";
        //       const mainBackgroundColor = "#ffffff";
        //       const buttonBackgroundColor = "#346df1";
        //       const buttonBorderColor = "#346df1";
        //       const buttonTextColor = "#ffffff";

        //       return `
        //     <body style="background: "#f9f9f9";">
        //       <table width="100%" border="0" cellspacing="0" cellpadding="0">
        //         <tr>
        //           <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: "#444444";">
        //             <strong>${escapedHost}</strong>
        //           </td>
        //         </tr>
        //       </table>
        //       <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: "#ffffff"; max-width: 600px; margin: auto; border-radius: 10px;">
        //         <tr>
        //           <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: "#444444";">
        //             Sign in as <strong>${escapedEmail}</strong>
        //           </td>
        //         </tr>
        //         <tr>
        //           <td align="center" style="padding: 20px 0;">
        //             <table border="0" cellspacing="0" cellpadding="0">
        //               <tr>
        //               <td align="center" style="padding: 10px 0px 0px 0px; font-size: 24px; font-family: Helvetica, Arial, sans-serif; color: "#444444";">
        //               Verification Code: <strong>${token}</strong>
        //             </td>
        //               </tr>
        //             </table>
        //           </td>
        //         </tr>
        //         <tr>
        //           <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: "#444444";">
        //             If you did not request this email you can safely ignore it.
        //           </td>
        //         </tr>
        //       </table>

        //     </body>
        //     `;
        //     }
        //     function text({ url, host, token, email }) {
        //       return `Enter verification code: ${token} to sign in to ${host}\n${url} for ${email}\n\n`;
        //     }
        //   });
        // },
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
      signIn: "/auth/signin", // Displays signin buttons
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
        // console.log(account);
        if (!user?.role) {
          user.role = "user";
          user.bio = "";
          user.website = "";
          user.socials = [];
          user.denials = 0;
          user.approved = "pending";
          // user.isNew = true;
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
        // if (user?.isNew) {
        //   token.isNew = user.isNew;
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
        // if (token?.isNew) {
        //   session.user.isNew = token.isNew;
        // }
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
    debug: true,
  });
}
// export default NextAuth({
//   // https://next-auth.js.org/configuration/providers

// });
