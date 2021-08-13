import Head from "next/head";

import { connectToDatabase } from "../utils/mongodb";

import Nav from "../components/Nav";

import { Button, useMediaQuery, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

export default function Home({ isConnected }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <>
      <Nav />
      {/* TODO fix iframe resizing */}
      {isMobile ? (
        <div>
          <Typography variant="h3" align="center">
            Eco-12
          </Typography>
          <iframe
            id="questionnaire"
            title="Inline Frame Example"
            width="100%"
            height="13500px"
            src="https://en.m.wikipedia.org/wiki/Appalachian_mixed_mesophytic_forests"
          ></iframe>
        </div>
      ) : (
        <div>
          <Typography variant="h3" align="center">
            Eco-12
          </Typography>
          <iframe
            id="questionnaire"
            title="Inline Frame Example"
            width="100%"
            height="7300px"
            src="https://en.m.wikipedia.org/wiki/Appalachian_mixed_mesophytic_forests"
          ></iframe>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const { client } = await connectToDatabase();

  const isConnected = await client.isConnected();

  return {
    props: { isConnected },
  };
}
