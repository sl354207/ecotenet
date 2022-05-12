import Header from "@components/Header";
import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { fetchGetJSON } from "@utils/stripe/api-helpers";
import { useRouter } from "next/router";
import useSWR from "swr";

const useStyles = makeStyles(() => ({
  status: { marginTop: 20 },
}));

const approved = () => {
  const classes = useStyles();
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
      <Typography variant="h6" align="center" className={classes.status}>
        Payment Status: {data?.status ?? "loading..."}
      </Typography>
      {/* ADD POSSIBLE ERROR MESSAGES AND ADD EMAIL AND THANK YOUS AND WHATNOT */}
    </Container>
  );
};

export default approved;
