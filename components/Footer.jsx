import {
  Button,
  Container,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
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

  return (
    <footer className={classes.footer}>
      <Divider />
      <Container className={`${classes.spacing} ${classes.container}`}>
        <Typography variant="body2" align="center" gutterBottom>
          Copyright &#169; Ecotenet 2022
        </Typography>

        <Grid container spacing={2} className={classes.spacing}>
          <Grid item xs={4} className={classes.text}>
            <Link href="/privacy" underline="hover">Privacy Policy</Link>
          </Grid>
          <Grid item xs={4} className={classes.text}>
            <Link href="/contact" underline="hover">Contact Us</Link>
          </Grid>
          <Grid item xs={4} className={classes.text}>
            <Link href="/featured" underline="hover">Featured Posts</Link>
          </Grid>
          <Grid item xs={4} className={classes.text}>
            <Link href="/terms" underline="hover">Terms of Use</Link>
          </Grid>
          <Grid item xs={4} className={classes.text}>
            <Link href="/about" underline="hover">About Us</Link>
          </Grid>
          <Grid item xs={4} className={classes.text}>
            <Link href="/species" underline="hover">Species Map</Link>
          </Grid>
          <Grid item xs={4} className={classes.text}>
            <Link href="/sitemap" underline="hover">Site Map</Link>
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
