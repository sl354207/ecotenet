import { useRouter } from "next/router";
import Meta from "./Meta";
import Nav from "./Nav";

// pass in children as a prop so any components in Layout tag in _app.js get rendered inside Layout
const Layout = ({ children, ecoFilter }) => {
  // UPDATE
  const router = useRouter();
  // console.log(router);
  return (
    <>
      <Meta />
      {!router.route == "/auth/new-user" && <Nav ecoFilter={ecoFilter} />}

      <div>
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
