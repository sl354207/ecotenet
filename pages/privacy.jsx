import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { Container, Typography } from "@mui/material";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";

const privacy = () => {
  return (
    <>
      <NextSeo
        title="Privacy Policy"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        // description="Ideas on the purpose of Ecotenet and the possible vision for the future"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/privacy",
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
      <Container
        sx={{
          backgroundColor: theme.palette.primary.light,
          paddingBottom: "20px",
          paddingTop: "5px",
          marginBlock: "20px",
        }}
      >
        <Header title="Privacy Policy" />
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Does Ecotenet collect anonymous data?</b>
        </Typography>
        <Typography variant="h6">
          We do not collect any anonymous data from you or your device.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>In what situations does Ecotenet collect personal data?</b>
        </Typography>
        <Typography variant="h6">
          If you create an Ecotenet account, we will collect your email address,
          but that is it.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Can I use Ecotenet anonymously?</b>
        </Typography>
        <Typography variant="h6">
          Yes. You can access all of Ecotenet&apos;s articles, species data, and
          forum discussions without creating an account. And if you don&apos;t
          create an account, we won&apos;t collect any personal data about you.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          But if you want to create a post, vote or comment on posts, or
          contribute to forum discussions you will need to create an account.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>If I create an account, what data will you collect?</b>
        </Typography>
        <Typography variant="h6">
          We&apos;ll ask you for your email address so you can use it to sign
          into Ecotenet.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          When you create an account on Ecotenet, you have the option of
          creating a public profile where you can add details about yourself and
          add links to your personal website or socials. If you choose not to
          make a public profile the only things that will be public about you
          are your username and a list of your published posts (if any).
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You have full control over your data and can remove any items you wish
          at any time.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>
            What does it mean exactly that I have full control over my data?
          </b>
        </Typography>
        <Typography variant="h6">
          It means that at any time, if you email us at{" "}
          <Link href="mailto:info@ecotenet.org">info@ecotenet.org</Link>, we
          will send you all of your data in a structured, machine-readable and
          commonly used format.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You can delete any of your profile data, posts, or comments. You can
          also delete your entire account at any time.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>
            When I delete my personal data from Ecotenet, is it really deleted
            from Ecotenet&apos;s servers?
          </b>
        </Typography>
        <Typography variant="h6">
          Yes. When you delete any data from Ecotenet, we immediately delete it
          from our servers.
        </Typography>
        {/* <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Does Ecotenet meet Europe&apos;s GDPR privacy regulations?</b>
        </Typography> */}
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Who has access to my personal data?</b>
        </Typography>
        <Typography variant="h6">
          Ecotenet has some staff who work directly on our databases. They have
          the ability to view your private data, but only do so when providing
          you with technical support.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          As for the personal data that you choose to share on your public
          profile, anyone on the internet can see it by navigating to your
          username&apos;s public URL. Again, we&apos;ve given you full control
          over what parts of your profile and data are public.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Can any other organizations access my data?</b>
        </Typography>
        <Typography variant="h6">
          We don&apos;t sell your data to anyone. In order to provide service to
          you, your data does pass through some other services.
          {/* All of these
          companies are based in the United States. */}
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          We use Amazon Web Services, DigitalOcean, and MongoDB Atlas for our
          servers and databases. You can read the privacy policy for{" "}
          <Link
            href="https://aws.amazon.com/privacy/"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Amazon Web Services
          </Link>
          ,{" "}
          <Link
            href="https://www.digitalocean.com/legal/privacy-policy"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            DigitalOcean
          </Link>
          , and{" "}
          <Link
            href="https://www.mongodb.com/legal/privacy-policy"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            MongoDB Atlas
          </Link>{" "}
          online. We use Stripe to process donations. You can read the privacy
          policy for{" "}
          <Link
            href="https://stripe.com/privacy"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stripe
          </Link>{" "}
          online. We use Vercel and Google Domains for hosting and Content
          Delivery Networks. You can read the privacy policy for{" "}
          <Link
            href="https://policies.google.com/privacy"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Domains
          </Link>{" "}
          and{" "}
          <Link
            href="https://vercel.com/legal/privacy-policy"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel
          </Link>{" "}
          online. We use Mapbox for our maps. You can read the privacy policy
          for{" "}
          <Link
            href="https://www.mapbox.com/legal/privacy"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mapbox
          </Link>{" "}
          online.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>What is Ecotenet&apos;s Donor Privacy Policy?</b>
        </Typography>
        <Typography variant="h6">
          Ecotenet will not share our donors&apos; names or personal information
          with anyone outside of our nonprofit organization&apos;s team. Donor
          information will only be used to process donations and send
          confirmations. This policy applies to any written, verbal, or
          electronic communication.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>
            Who can I contact if I have questions about my privacy on Ecotenet?
          </b>
        </Typography>
        <Typography variant="h6">
          Email us at{" "}
          <Link href="mailto:info@ecotenet.org">info@ecotenet.org</Link>.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>How can I find out about changes?</b>
        </Typography>
        <Typography variant="h6">
          This version of Ecotenet&apos;s privacy questions and answers took
          effect on November 27, 2023. Ecotenet may update its contact
          information in these questions and answers by updating this page
          (https://www.ecotenet.org/privacy). Ecotenet may change how it
          announces changes in a future version of these questions and answers.
        </Typography>
        <Typography variant="subtitle2" sx={{ marginTop: "20px" }}>
          This Privacy Policy has been adapted from{" "}
          <Link
            href="https://www.freecodecamp.org/news/privacy-policy/"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            freecodecamp
          </Link>{" "}
          and{" "}
          <Link
            href="https://www.inaturalist.org/pages/privacy"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            iNaturalist
          </Link>
          .
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default privacy;
