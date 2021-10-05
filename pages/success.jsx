// UPDATE TO ECORGEGION INDEX OR SOMETHING
// UPDATE

import Head from "next/head";

import { connectToDatabase } from "../utils/mongodb";

import Nav from "../components/Nav";

import {
  Button,
  useMediaQuery,
  Typography,
  Container,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: 40,
  },
}));

export default function Home({ isConnected }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <>
      {/* <Nav /> */}
      {/* TODO fix iframe resizing */}
      {isMobile ? (
        <div>
          <Typography variant="h3" align="center" className={classes.title}>
            Eco-313
          </Typography>
          <Container>
            <iframe
              id="questionnaire"
              title="Inline Frame Example"
              width="100%"
              height="13500px"
              src="https://en.m.wikipedia.org/wiki/Appalachian_mixed_mesophytic_forests"
            ></iframe>
          </Container>
        </div>
      ) : (
        <div>
          <Typography variant="h3" align="center" className={classes.title}>
            Eco-313
          </Typography>
          <Container>
            <iframe
              id="questionnaire"
              title="Inline Frame Example"
              width="100%"
              height="7300px"
              src="https://en.m.wikipedia.org/wiki/Appalachian_mixed_mesophytic_forests"
            ></iframe>
          </Container>
        </div>
      )}
    </>
  );
}

// CHANGE
export async function getServerSideProps(context) {
  const { client } = await connectToDatabase();

  const isConnected = 10;

  return {
    props: { isConnected },
  };
}
