import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import { Container, Typography } from "@mui/material";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const tip = () => {
  const router = useRouter();

  const name = router.query.q;
  return (
    <>
      <NextSeo noindex={true} nofollow={true} />
      <Container>
        {name && (
          <>
            <Header title="Tipping" />
            <Typography align="center" variant="h6" sx={{ marginTop: "20px" }}>
              We are currently working on adding the ability to tip people in
              cryptocurrencies...more to come.
            </Typography>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default tip;
