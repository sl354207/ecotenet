import Meta from "./Meta";
import Nav from "./Nav";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// import Header from './Header'
// import styles from '../styles/Layout.module.css'

// pass in children as a prop so any components in Layout tag in _app.js get rendered inside Layout
const Layout = ({ children, ecoFilter }) => {
  // UPDATE

  // const router = useRouter();

  // // category filter logic. Revisit
  // const [ecoFilter, setEcoFilter] = useState("");

  // // use useEffect to interact with (external sources)  session storage in browser. Set session storage variable to ecoregion whenever an ecoregion is visited. Keep this variable in storage until another ecoregion is visited and reset. Set this variable to state so that categories can be filtered to specific ecoregion. Filter will only be shown if ecoregion is visited and session storage variable is set.
  // useEffect(() => {
  //   let ecoregion = sessionStorage.getItem("ecoregion");

  //   if (router.pathname == "/mammals") {
  //     sessionStorage.setItem("ecoregion", router.pathname);
  //     setEcoFilter(router.pathname);
  //   } else {
  //     setEcoFilter(ecoregion);
  //   }
  // }, [router.pathname]);
  return (
    <>
      <Meta />
      <Nav ecoFilter={ecoFilter} />
      <div>
        <main>
          {/* <Header /> */}
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
