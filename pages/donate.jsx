import { Container } from "@material-ui/core";
import DonateForm from "../components/DonateForm";
import Header from "../components/Header";

const donate = () => {
  return (
    <Container>
      <Header title="Donations" />
      <DonateForm />
    </Container>
  );
};

export default donate;
