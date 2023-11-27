import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { Button, Container, Typography } from "@mui/material";
import theme from "@utils/theme";
import { useRouter } from "next/router";

export default function Custom500() {
  const router = useRouter();
  return (
    <>
      <Container
        sx={{
          backgroundColor: theme.palette.primary.light,
          paddingBottom: "20px",
          paddingTop: "5px",
          marginBlock: "20px",
        }}
      >
        <Header title="500 - Internal Server Error" />
        <Typography align="center" variant="h6" sx={{ marginTop: "20px" }}>
          Sorry, something went wrong
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.reload()}
            sx={{ marginRight: "10px" }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push("/")}
            sx={{ marginLeft: "10px" }}
          >
            Go Home
          </Button>
        </div>

        <Typography align="center" variant="h6" sx={{ marginTop: "20px" }}>
          For general support you can contact us through the forum at{" "}
          <Link href="https://forum.ecotenet.org/category/3/support">
            Support.
          </Link>
        </Typography>
        <Typography align="center" variant="h6" sx={{ marginTop: "20px" }}>
          Or you can contact us directly at{" "}
          <Link href="mailto:info@ecotenet.org">info@ecotenet.org</Link>
        </Typography>
      </Container>

      <Footer />
    </>
  );
}
