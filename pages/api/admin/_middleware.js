import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === "admin",
  },
  // callbacks: {
  //   authorized: ({ req, token }) => {
  //     console.log(req);
  //     if (token?.role === "admin") {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   },
  // },
});
