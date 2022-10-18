import { SnackbarProvider } from "@components/context/SnackbarContext";
import Meta from "@components/layouts/Meta";
import Nav from "@components/layouts/Nav";
import { useRouter } from "next/router";

// pass in children as a prop so any components in Layout tag in _app.js get rendered inside Layout
const MainLayout = ({
  children,
  ecoFilter,
  state,
  dispatch,
  setTab,
  drawerOpen,
  setDrawerOpen,
  setOpenEco,
}) => {
  // UPDATE
  const router = useRouter();
  // console.log(router);
  return (
    <>
      <Meta />

      <SnackbarProvider>
        {router.route !== "/auth/new-user" && (
          <Nav
            ecoFilter={ecoFilter}
            state={state}
            dispatch={dispatch}
            setTab={setTab}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            setOpenEco={setOpenEco}
          />
        )}
        <div>
          <main>{children}</main>
        </div>
      </SnackbarProvider>
    </>
  );
};

export default MainLayout;
