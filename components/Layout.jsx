import Meta from "./Meta";
import Nav from "./Nav";

// pass in children as a prop so any components in Layout tag in _app.js get rendered inside Layout
const Layout = ({ children, ecoFilter }) => {
  // UPDATE

  return (
    <>
      <Meta />
      <Nav ecoFilter={ecoFilter} />
      <div>
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
