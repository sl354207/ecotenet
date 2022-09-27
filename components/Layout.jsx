import { useRouter } from "next/router";
import Meta from "./Meta";
import Nav from "./Nav";
import { SnackbarProvider } from "./SnackbarContext";

// pass in children as a prop so any components in Layout tag in _app.js get rendered inside Layout
const Layout = ({ children, ecoFilter, state, dispatch }) => {
  // UPDATE
  const router = useRouter();
  // console.log(router);
  return (
    <>
      <Meta />

      <SnackbarProvider>
        {router.route !== "/auth/new-user" && (
          <Nav ecoFilter={ecoFilter} state={state} dispatch={dispatch} />
        )}
        <div>
          <main>{children}</main>
        </div>
      </SnackbarProvider>
    </>
  );
};

export default Layout;
