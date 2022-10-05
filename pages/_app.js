import Layout from "@components/Layout";
import { UserProvider } from "@components/UserContext";

import "@styles/globals.css";

import { SessionProvider } from "next-auth/react";

import { useRouter } from "next/router";

import { useEffect, useReducer, useState } from "react";

import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import createEmotionCache from "@utils/createEmotionCache";
import theme from "@utils/theme";
import Head from "next/head";
import PropTypes from "prop-types";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const speciesChips = [
  { count: 0 },
  {
    id: 1,
    _id: "",
    regions: [],
    common_name: "",
    scientific_name: "",
    open: false,
  },
  {
    id: 2,
    _id: "",
    regions: [],
    common_name: "",
    scientific_name: "",
    open: false,
  },
  {
    id: 3,
    _id: "",
    regions: [],
    common_name: "",
    scientific_name: "",
    open: false,
  },
];

// reducer function used by useReducer hook. Toggles the openList value from true to false in menuItems to open and close the correct dropdowns on the drawer
const reducer = (speciesChips, action) => {
  if (action.type == "remove") {
    switch (action.payload) {
      case 1:
        speciesChips[1].open = speciesChips[2].open;
        speciesChips[1].regions = speciesChips[2].regions;
        speciesChips[1].scientific_name = speciesChips[2].scientific_name;
        speciesChips[1].common_name = speciesChips[2].common_name;
        speciesChips[1]._id = speciesChips[2]._id;

        speciesChips[2].open = speciesChips[3].open;
        speciesChips[2].regions = speciesChips[3].regions;
        speciesChips[2].scientific_name = speciesChips[3].scientific_name;
        speciesChips[2].common_name = speciesChips[3].common_name;
        speciesChips[2]._id = speciesChips[3]._id;

        speciesChips[3].open = false;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;
        speciesChips[3]._id = action._id;

        speciesChips[0].count -= 1;
        return { ...speciesChips };

      case 2:
        speciesChips[2].open = speciesChips[3].open;
        speciesChips[2].regions = speciesChips[3].regions;
        speciesChips[2].scientific_name = speciesChips[3].scientific_name;
        speciesChips[2].common_name = speciesChips[3].common_name;
        speciesChips[2]._id = speciesChips[3]._id;

        speciesChips[3].open = false;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;
        speciesChips[3]._id = action._id;

        speciesChips[0].count -= 1;
        return { ...speciesChips };

      case 3:
        speciesChips[3].open = false;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;
        speciesChips[3]._id = action._id;
        speciesChips[0].count -= 1;
        return { ...speciesChips };

      default:
        throw new Error();
    }
  }
  if (action.type == "add") {
    switch (action.payload) {
      case 0:
        speciesChips[1].open = true;
        speciesChips[1].regions = action.value;
        speciesChips[1].scientific_name = action.s_name;
        speciesChips[1].common_name = action.c_name;
        speciesChips[1]._id = action._id;
        if (speciesChips[0].count == 0) {
          speciesChips[0].count = 1;
        } else {
          speciesChips[0].count = speciesChips[0].count;
        }

        return { ...speciesChips };
      case 1:
        speciesChips[1].open = true;
        speciesChips[1].regions = action.value;
        speciesChips[1].scientific_name = action.s_name;
        speciesChips[1].common_name = action.c_name;
        speciesChips[1]._id = action._id;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      case 2:
        speciesChips[2].open = true;
        speciesChips[2].regions = action.value;
        speciesChips[2].scientific_name = action.s_name;
        speciesChips[2].common_name = action.c_name;
        speciesChips[2]._id = action._id;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      case 3:
        speciesChips[3].open = true;
        speciesChips[3].regions = action.value;
        speciesChips[3].scientific_name = action.s_name;
        speciesChips[3].common_name = action.c_name;
        speciesChips[3]._id = action._id;
        speciesChips[0].count += 1;
        return { ...speciesChips };

      default:
        throw new Error();
    }
  }
};

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

  const [ecoFilter, setEcoFilter] = useState();
  const [visited, setVisited] = useState();

  // use useEffect to interact with (external sources)  session storage in browser. Set session storage variable to ecoregion whenever an ecoregion is visited. Keep this variable in storage until another ecoregion is visited and reset. Set this variable to state so that categories can be filtered to specific ecoregion. Filter will only be shown if ecoregion is visited and session storage variable is set.
  useEffect(() => {
    let ecoregion = sessionStorage.getItem("ecoregion");

    setEcoFilter(JSON.parse(ecoregion));
  }, [router.pathname]);

  useEffect(() => {
    let visitedHome = localStorage.getItem("visited");

    if (router.pathname == "/") {
      localStorage.setItem("visited", true);
      setVisited(visitedHome);
    } else {
      setVisited(visitedHome);
    }
  }, [router.pathname == "/"]);

  const [state, dispatch] = useReducer(reducer, speciesChips);

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
            <Layout ecoFilter={ecoFilter} state={state} dispatch={dispatch}>
              <Component
                ecoFilter={ecoFilter}
                setEcoFilter={setEcoFilter}
                state={state}
                dispatch={dispatch}
                visited={visited}
                {...pageProps}
              />
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
