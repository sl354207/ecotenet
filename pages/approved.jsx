import Header from "@components/layouts/Header";
import { Container, Typography } from "@mui/material";
import { fetchGetJSON } from "@utils/stripe/stripeApiHelpers";
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

  if (error) return <div>failed to load</div>;
  return (
    <Container>
      <Header title="Checkout Results" />
      <Typography variant="h6" align="center" sx={{ marginTop: "20px" }}>
        Payment Status: {data?.status ?? "loading..."}
      </Typography>
      {/* ADD POSSIBLE ERROR MESSAGES AND ADD EMAIL AND THANK YOUS AND WHATNOT */}
    </Container>
  );
};

export default approved;
