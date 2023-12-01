import DonateForm from "@components/forms/DonateForm";
import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import {
  Box,
  CircularProgress,
  Container,
  LinearProgress,
  Typography,
  linearProgressClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import fetcher from "@utils/fetcher";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import useSWR from "swr";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.dark,
  },
}));
const donate = () => {
  const [serverProgress, setServerProgress] = useState(5);
  const [laborProgress, setLaborProgress] = useState(5);

  const {
    data: results,
    isLoading,
    error,
  } = useSWR("/api/donations", fetcher, {
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (results) {
      if (results[0].server_monthly < 5) {
        setServerProgress(5);
      } else {
        setServerProgress(results[0].server_monthly);
      }
      if (results[0].labor_monthly < 5) {
        setLaborProgress(5);
      } else {
        setLaborProgress(results[0].labor_monthly);
      }
    }
    console.log(results);
  }, [results]);

  let progress;

  if (isLoading) {
    progress = (
      <CircularProgress
        color="secondary"
        size={100}
        disableShrink={true}
        sx={{
          margin: "20px auto",
          display: "flex",
          justifySelf: "center",
        }}
      />
    );
  } else {
    if (error) {
      progress = <></>;
    } else {
      progress = (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                marginBlock: "auto",
                marginRight: "10px",
                minWidth: "160px",
              }}
            >
              Hosting/Server Costs:
            </Typography>
            <BorderLinearProgress
              variant="determinate"
              value={serverProgress}
              sx={{ width: "100%", marginBlock: "auto" }}
            />
            <Typography
              variant="body1"
              sx={{
                marginBlock: "auto",
                marginLeft: "10px",
                minWidth: "160px",
              }}
            >
              $75/month
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography
              variant="body1"
              align="right"
              sx={{
                marginBlock: "auto",
                marginRight: "10px",
                minWidth: "160px",
              }}
            >
              Labor Costs:
            </Typography>
            <BorderLinearProgress
              variant="determinate"
              value={laborProgress}
              sx={{ width: "100%", marginBlock: "auto" }}
            />
            <Typography
              variant="body1"
              sx={{
                marginBlock: "auto",
                marginLeft: "10px",
                minWidth: "160px",
              }}
            >
              $1000/month
            </Typography>
          </Box>
        </>
      );
    }
  }
  return (
    <>
      <NextSeo
        title="Donate"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        description="Ecotenet is a non-profit supported by donations from from people like you. Thank you"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/donate",
          siteName: "Ecotenet",
          images: [
            {
              url: "https://www.ecotenet.org/logo.svg",
              width: 1200,
              height: 630,
              alt: "Ecotenet logo",
            },
          ],
        }}
      />
      <Container maxWidth="sm">
        <Header title="Donations" />
        <DonateForm />
      </Container>
      <Container>
        <Box sx={{ width: "100%" }}>{progress}</Box>

        <Typography variant="body1" align="center" sx={{ marginTop: "20px" }}>
          Ecotenet is 501(c)(3) nonprofit organization. We rely on donations
          from people like you to keep running and growing.
        </Typography>
        <Typography variant="body1" align="center" sx={{ marginTop: "20px" }}>
          Thank You!
        </Typography>
        <Typography variant="body1" align="center" sx={{ marginTop: "20px" }}>
          For donation related questions email us at{" "}
          <Link href="mailto:info@ecotenet.org">info@ecotenet.org</Link>
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default donate;
