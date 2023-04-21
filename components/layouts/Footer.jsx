import Link from "@components/layouts/Link";
import { Button, Container, Divider, Grid, Typography } from "@mui/material";

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
            <Link href="/data" underline="hover">
              Species Data
            </Link>
          </Grid>

          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Link href="/terms" underline="hover">
              Terms of Service
            </Link>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Link href="/about" underline="hover">
              About Us
            </Link>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Link href="/sponsors" underline="hover">
              Sponsors
            </Link>
          </Grid>

          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Link href="/conduct" underline="hover">
              Code of Conduct
            </Link>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Link href="/disclaimer" underline="hover">
              Disclaimer
            </Link>
          </Grid>

          <Grid item xs={4} sx={{ textAlign: "center" }}>
            <Button
              href="/donate"
              variant="contained"
              color="secondary"
              size="small"
            >
              Donate
            </Button>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
