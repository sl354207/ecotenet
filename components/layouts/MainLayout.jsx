import { HomepageProvider } from "@components/context/HomepageContext";
import { SnackbarProvider } from "@components/context/SnackbarContext";
// import { useUserContext } from "@components/context/UserContext";
import Meta from "@components/layouts/Meta";
import Nav from "@components/layouts/Nav";
import { useRouter } from "next/router";
// import { useEffect } from "react";

// pass in children as a prop so any components in Layout tag in _app.js get rendered inside Layout
const MainLayout = ({ children }) => {
  // const { user } = useUserContext();
  const router = useRouter();
  // useEffect(() => {
  //   console.log(user);
  //   if (
  //     user &&
  //     user.status === "authenticated" &&
  //     (user.name === null || user.name === "" || user.name === undefined)
  //   ) {
  //     router.push("/auth/new-user");
  //   }
  // }, [user]);

  return (
    <>
      <Meta />
      <HomepageProvider>
        <SnackbarProvider>
          {router.route !== "/auth/new-user" && <Nav />}
          <div>
            <main>{children}</main>
          </div>
        </SnackbarProvider>
      </HomepageProvider>
    </>
  );
};

export default MainLayout;
