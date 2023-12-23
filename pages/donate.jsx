import DonateForm from "@components/forms/DonateForm";
import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import CheckIcon from "@mui/icons-material/Check";
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
    if (results && results.length > 0) {
      const monthlyServer = results[0].server_cost;
      const monthlyLabor = results[0].labor_cost;
      const monthlyServerMin = monthlyServer * 0.05;
      const monthlyLaborMin = monthlyLabor * 0.05;

      const monthly = results[0].monthly;
      const oneTime = results[0].one_time;
      const total = monthly + oneTime;

      if (total > monthlyServer + monthlyLabor) {
        setServerProgress(100);
        setLaborProgress(100);
      } else if (total > monthlyServer) {
        setServerProgress(100);
        if (total > monthlyServer + monthlyLaborMin) {
          setLaborProgress(((total - monthlyServer) / monthlyLabor) * 100);
        } else {
          setLaborProgress(5);
        }
      } else {
        if (total > monthlyServerMin) {
          setServerProgress((total / monthlyServer) * 100);
        } else {
          setServerProgress(5);
        }
        setLaborProgress(5);
      }
    }
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
                minWidth: "100px",
              }}
            >
              ${results && results[0].server_cost}/month
            </Typography>
            {serverProgress === 100 && (
              <CheckIcon
                sx={{
                  marginBlock: "auto",
                  marginLeft: "10px",
                  color: "#07fb13",
                }}
                fontSize="large"
              />
            )}
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
                minWidth: "100px",
              }}
            >
              ${results && results[0].labor_cost}/month
            </Typography>
            {laborProgress === 100 && (
              <CheckIcon
                sx={{
                  marginBlock: "auto",
                  marginLeft: "10px",
                  color: "#07fb13",
                }}
                fontSize="large"
              />
            )}
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
              url: "https://www.ecotenet.org/logo_social.png",
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
