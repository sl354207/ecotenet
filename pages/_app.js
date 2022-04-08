import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../utils/theme";
import Layout from "../components/Layout";

export default function MyApp(props) {
  const { Component, pageProps } = props;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const router = useRouter();
  // category filter logic. Revisit
  const [ecoFilter, setEcoFilter] = useState("");

  // use useEffect to interact with (external sources)  session storage in browser. Set session storage variable to ecoregion whenever an ecoregion is visited. Keep this variable in storage until another ecoregion is visited and reset. Set this variable to state so that categories can be filtered to specific ecoregion. Filter will only be shown if ecoregion is visited and session storage variable is set.
  useEffect(() => {
    let ecoregion = sessionStorage.getItem("ecoregion");

    if (router.pathname == "/success") {
      sessionStorage.setItem("ecoregion", router.pathname);
      setEcoFilter(router.pathname);
    } else {
      setEcoFilter(ecoregion);
    }
  }, [router.pathname]);

  return (
    <>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Layout ecoFilter={ecoFilter}>
          <Component ecoFilter={ecoFilter} {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
