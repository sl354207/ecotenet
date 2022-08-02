import Layout from "@components/Layout";
import { UserProvider } from "@components/UserContext";

import "@styles/globals.css";

import { SessionProvider } from "next-auth/react";

import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import createEmotionCache from "@utils/createEmotionCache";
import theme from "@utils/theme";
import Head from "next/head";
import PropTypes from "prop-types";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const router = useRouter();
  // console.log(router);
  // category filter logic. Revisit
  const [ecoFilter, setEcoFilter] = useState("");

  // use useEffect to interact with (external sources)  session storage in browser. Set session storage variable to ecoregion whenever an ecoregion is visited. Keep this variable in storage until another ecoregion is visited and reset. Set this variable to state so that categories can be filtered to specific ecoregion. Filter will only be shown if ecoregion is visited and session storage variable is set.
  useEffect(() => {
    let ecoregion = sessionStorage.getItem("ecoregion");

    if (router.pathname == "/ecoregions/[eco]") {
      sessionStorage.setItem("ecoregion", router.query.eco);
      setEcoFilter(router.query.eco);
    } else {
      setEcoFilter(ecoregion);
    }
  }, [router.pathname]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <UserProvider>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Layout ecoFilter={ecoFilter}>
              <Component ecoFilter={ecoFilter} {...pageProps} />
            </Layout>
          </ThemeProvider>
        </UserProvider>
      </SessionProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
