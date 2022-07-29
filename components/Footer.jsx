import { Button, Container, Divider, Grid, Typography } from "@mui/material";
import Link from "./Link";

const Footer = () => {
  return (
    <footer
      style={{
        position: "relative",
        bottom: "20px",
        left: 0,
        right: 0,
        marginTop: "40px",
      }}
    >
      <Divider />
      <Container sx={{ minHeight: "fit-content", marginTop: "20px" }}>
        <Typography variant="body2" align="center" gutterBottom>
          Copyright &#169; Ecotenet 2022
        </Typography>

        <Grid container spacing={2} sx={{ marginTop: "20px" }}>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Link href="/privacy" underline="hover">
              Privacy Policy
            </Link>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Link href="/contact" underline="hover">
              Contact Us
            </Link>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Link href="/featured" underline="hover">
              Featured Posts
            </Link>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Link href="/terms" underline="hover">
              Terms of Use
            </Link>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Link href="/about" underline="hover">
              About Us
            </Link>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Link href="/species" underline="hover">
              Species Map
            </Link>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Link href="/sitemap" underline="hover">
              Site Map
            </Link>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}></Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
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
