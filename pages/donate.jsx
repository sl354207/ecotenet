import DonateForm from "@components/DonateForm";
import Header from "@components/Header";
import { Container } from "@material-ui/core";

const donate = () => {
  return (
    <Container maxWidth="md">
      <Header title="Donations" />
      <DonateForm />
    </Container>
  );
};

export default donate;
