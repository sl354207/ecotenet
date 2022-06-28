import DonateForm from "@components/DonateForm";
import Header from "@components/Header";
import { Container } from "@mui/material";

const donate = () => {
  return (
    <Container maxWidth="sm">
      <Header title="Donations" />
      <DonateForm />
    </Container>
  );
};

export default donate;
