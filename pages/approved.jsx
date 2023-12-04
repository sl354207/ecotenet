import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { CircularProgress, Container, Typography } from "@mui/material";
import { fetchGetJSON } from "@utils/stripe/stripeApiHelpers";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";

import { useRouter } from "next/router";
import useSWR from "swr";

const approved = () => {
  const router = useRouter();

  const { data, error } = useSWR(
    router.query.session_id ? `/api/checkout/${router.query.session_id}` : null,
    fetchGetJSON,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

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
        <Header title="Checkout Results" />

        {data || (data && data.status !== "open") ? (
          <>
            {data?.statusCode === 500 ? (
              <Typography
                variant="h6"
                align="center"
                sx={{ marginTop: "20px" }}
              >
                Invalid Request. Please Try Again
              </Typography>
            ) : (
              <>
                <Typography
                  variant="h5"
                  align="center"
                  sx={{ marginTop: "20px" }}
                >
                  payment status: {data?.status}
                </Typography>
                {data?.status === "complete" && (
                  <>
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{ marginTop: "20px" }}
                    >
                      Thank you for the donation!
                    </Typography>
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{ marginTop: "20px" }}
                    >
                      Your confirmation ID is:{" "}
                      {data?.payment_intent || data?.subscription}
                    </Typography>
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{ marginTop: "20px" }}
                    >
                      If you need a receipt please email us at{" "}
                      <Link href="mailto:info@ecotenet.org">
                        info@ecotenet.org
                      </Link>{" "}
                      with your confirmation ID
                    </Typography>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {error ? (
              <Typography
                variant="h6"
                align="center"
                sx={{ marginTop: "20px" }}
              >
                Sorry, something went wrong. Please reload the page
              </Typography>
            ) : (
              <>
                {!router.query.session_id ? (
                  <></>
                ) : (
                  <CircularProgress
                    size={50}
                    color="secondary"
                    disableShrink={true}
                    sx={{
                      margin: "20px auto",

                      display: "flex",
                      justifySelf: "center",
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default approved;
