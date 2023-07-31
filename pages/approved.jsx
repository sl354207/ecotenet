import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { CircularProgress, Container, Typography } from "@mui/material";
import { fetchGetJSON } from "@utils/stripe/stripeApiHelpers";
import { NextSeo } from "next-seo";

import { useRouter } from "next/router";
import useSWR from "swr";

const approved = () => {
  const router = useRouter();

  // Fetch CheckoutSession from static page via
  // https://nextjs.org/docs/basic-features/data-fetching#static-generation
  const { data, error } = useSWR(
    router.query.session_id ? `/api/checkout/${router.query.session_id}` : null,
    fetchGetJSON
  );
  // console.log(data);

  if (error)
    return <div>Sorry, something went wrong. Please reload the page</div>;
  return (
    <>
      <NextSeo noindex={true} nofollow={true} />
      <Container>
        <Header title="Checkout Results" />
        {data || (data && data.status === "open") ? (
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
          <CircularProgress
            size={50}
            color="secondary"
            disableShrink={true}
            sx={{
              margin: "20px auto",
              // margin: { xs: "auto", md: "0px 150px 0px 160px" },
              display: "flex",
              justifySelf: "center",
            }}
          />
        )}

        {/* {data && data} */}
        {/* ADD POSSIBLE ERROR MESSAGES AND ADD EMAIL AND THANK YOUS AND WHATNOT */}
      </Container>
    </>
  );
};

export default approved;
