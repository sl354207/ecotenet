import DonateForm from "@components/forms/DonateForm";
import Header from "@components/layouts/Header";
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
