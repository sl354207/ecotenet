import Nav from "../components/Nav";

import { Button, useMediaQuery, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const mammal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <>
      <Nav />
      {/* TODO fix iframe resizing */}
      {isMobile ? (
        <div>
          <Typography variant="h3" align="center">
            Blarina brevicauda: Northern Short-tailed Shrew
          </Typography>
          <iframe
            id="questionnaire"
            title="Inline Frame Example"
            width="100%"
            height="13500px"
            src="https://en.m.wikipedia.org/wiki/Northern_short-tailed_shrew"
          ></iframe>
        </div>
      ) : (
        <div>
          <Typography variant="h3" align="center">
            Blarina brevicauda: Northern Short-tailed Shrew
          </Typography>
          <iframe
            id="questionnaire"
            title="Inline Frame Example"
            width="100%"
            height="7300px"
            src="https://en.m.wikipedia.org/wiki/Northern_short-tailed_shrew"
          ></iframe>
        </div>
      )}
    </>
  );
};

export default mammal;
