import Header from "@components/layouts/Header";
import { Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

const tip = () => {
  const router = useRouter();
  //   console.log(router.query);
  const name = router.query.q;
  return (
    <Container>
      {name && (
        <>
          <Header title={`Tip ${name}`} />
          <Typography align="center" variant="h6" sx={{ marginTop: "20px" }}>
            We are currently working on adding the ability to tip people in
            cryptocurrencies...more to come.
          </Typography>
        </>
      )}
    </Container>
  );
};

export default tip;
