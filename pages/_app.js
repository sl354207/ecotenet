import { UserProvider } from "@components/context/UserContext";

import "@styles/globals.css";

import { SessionProvider } from "next-auth/react";

import MainLayout from "@components/layouts/MainLayout";

import createEmotionCache from "@utils/createEmotionCache";
import theme from "@utils/theme";

import { useRouter } from "next/router";

import ErrorBoundary from "@components/layouts/ErrorBoundary";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import PropTypes from "prop-types";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const router = useRouter();

  return (
    <ErrorBoundary>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <UserProvider>
            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <MainLayout>
                <Component key={router.asPath} {...pageProps} />
              </MainLayout>
            </ThemeProvider>
          </UserProvider>
        </SessionProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
