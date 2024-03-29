import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import { Container, Typography } from "@mui/material";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const tip = () => {
  const router = useRouter();

  const name = router.query.q;
  return (
    <>
      <NextSeo noindex={true} nofollow={true} />
      <Container
        sx={{
          backgroundColor: theme.palette.primary.light,
          paddingBottom: "20px",
          paddingTop: "5px",
          marginBlock: "20px",
        }}
      >
        {name && (
          <>
            <Header title="Tipping" />
            <Typography align="center" variant="h6" sx={{ marginTop: "20px" }}>
              We are currently working on adding the ability to tip
              people...more to come.
            </Typography>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default tip;
