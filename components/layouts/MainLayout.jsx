import { HomepageProvider } from "@components/context/HomepageContext";
import { SnackbarProvider } from "@components/context/SnackbarContext";

import Nav from "@components/layouts/Nav";
import { useRouter } from "next/router";

// pass in children as a prop so any components in Layout tag in _app.js get rendered inside Layout
const MainLayout = ({ children }) => {
  // const { user } = useUserContext();
  const router = useRouter();

  return (
    <>
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
