import Meta from "./Meta";
import Nav from "./Nav";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// import Header from './Header'
// import styles from '../styles/Layout.module.css'

// pass in children as a prop so any components in Layout tag in _app.js get rendered inside Layout
const Layout = ({ children, ecoFilter }) => {
  // UPDATE

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
