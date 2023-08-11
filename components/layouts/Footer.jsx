import Link from "@components/layouts/Link";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";

const TikTokIcon = ({ color = "#000000", width = "1em", height = "1em" }) => {
  return (
    <svg
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width={width}
      height={height}
    >
      <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
    </svg>
  );
};

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
          Copyright &#169; Ecotenet 2023. We are 501(c)(3) nonprofit
          organization
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "12px",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="facebook"
            size="small"
            href="https://www.facebook.com/ecotenet.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="instagram"
            size="small"
            href="https://www.instagram.com/ecotenet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="twitter"
            size="small"
            href="https://twitter.com/ecotenet_org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="youtube"
            size="small"
            href="https://www.youtube.com/@ecotenet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YouTubeIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="tiktok"
            size="small"
            href="https://www.tiktok.com/@ecotenet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TikTokIcon color="white" width="24px" height="24px" />
          </IconButton>
        </div>

        <Grid container spacing={2} sx={{ marginTop: "0px" }}>
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
