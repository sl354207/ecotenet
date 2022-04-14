import {
  Button,
  Container,
  Divider,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";

import { alpha, makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.secondary.light,
  },
  spacing: {
    marginTop: 20,
  },
  text: {
    textAlign: "center",
  },
  footer: {
    position: "relative",
    bottom: 20,
    left: 0,
    right: 0,
    marginTop: 40,
  },
  container: {
    minHeight: "fit-content",
  },
}));

const Footer = () => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <footer className={classes.footer}>
      <Divider />
      <Container className={`${classes.spacing} ${classes.container}`}>
        <Typography variant="body2" align="center" gutterBottom>
          Copyright &#169; Ecotenet 2022
        </Typography>

        <Grid container spacing={2} className={classes.spacing}>
          <Grid item xs={4} className={classes.text}>
            <Link href="/privacy" className={classes.link}>
              Privacy Policy
            </Link>
          </Grid>

          <Grid item xs={4} className={classes.text}>
            <Link href="/contact" className={classes.link}>
              Contact Us
            </Link>
          </Grid>
          <Grid item xs={4} className={classes.text}>
            <Link href="/featured" className={classes.link}>
              Featured Posts
            </Link>
          </Grid>
          <Grid item xs={4} className={classes.text}>
            <Link href="/terms" className={classes.link}>
              Terms of Use
            </Link>
          </Grid>
          <Grid item xs={4} className={classes.text}>
            <Link href="/about" className={classes.link}>
              About Us
            </Link>
          </Grid>
          <Grid item xs={4} className={classes.text}>
            <Link href="/species" className={classes.link}>
              Species Map
            </Link>
          </Grid>
          <Grid item xs={4} className={classes.text}>
            <Link href="/sitemap" className={classes.link}>
              Site Map
            </Link>
          </Grid>
          <Grid item xs={4} className={classes.text}></Grid>
          <Grid item xs={4} className={classes.text}>
            <Button href="/donate" variant="contained" color="secondary">
              Donate
            </Button>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;