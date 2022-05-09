import { fetchGetJSON } from "@utils/stripe/api-helpers";
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

  const formattedContent = JSON.stringify(data, null, 2);

  if (error) return <div>failed to load</div>;
  return (
    <>
      <h1>Checkout Payment Result</h1>
      <h2>Status: {data?.payment_intent?.status ?? "loading..."}</h2>
      <h3>CheckoutSession response:</h3>
      <pre>{formattedContent ?? "loading..."}</pre>
    </>
  );
};

export default approved;
