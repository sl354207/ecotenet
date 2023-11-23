import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { Container, Typography } from "@mui/material";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";

const conduct = () => {
  return (
    <>
      <NextSeo
        title="Code of Conduct"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        // description="Ideas on the purpose of Ecotenet and the possible vision for the future"
        openGraph={{
          type: "website",
          url: "https://www.ecotenet.org/conduct",
          siteName: "Ecotenet",
          images: [
            {
              url: "https://www.ecotenet.org/logo.svg",
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
        <Header title="Code of Conduct" />
        <Typography align="center" variant="h6" sx={{ marginTop: "20px" }}>
          By using Ecotenet, you agree that you will follow this code of
          conduct:
        </Typography>
        <Typography
          variant="h6"
          sx={{ marginTop: "20px", paddingLeft: "25px" }}
        >
          <b>A short summary:</b> Be nice. No harassment, trolling, or spamming.
        </Typography>

        <ul>
          <li>
            <Typography variant="h6" sx={{ marginTop: "20px" }}>
              <b>Harassment</b> includes sexual language and imagery, deliberate
              intimidation, stalking, name-calling, unwelcome attention, libel,
              and any malicious hacking or social engineering. Ecotenet should
              be a harassment-free experience for everyone, regardless of
              gender, gender identity and expression, age, sexual orientation,
              disability, physical appearance, body size, income, race, national
              origin, or religion (or lack thereof).
            </Typography>
          </li>
          <li>
            <Typography variant="h6" sx={{ marginTop: "20px" }}>
              <b>Trolling</b> includes posting inflammatory comments to provoke
              an emotional response or disrupt discussions.
            </Typography>
          </li>
          <li>
            <Typography variant="h6" sx={{ marginTop: "20px" }}>
              <b>Spamming</b> includes posting off-topic messages to disrupt
              discussions, promote a product, solicit donations, advertise a
              job/internship/gig, or flooding discussions with files or text.
            </Typography>
          </li>
        </ul>

        <Typography
          variant="h6"
          sx={{ marginTop: "20px", paddingLeft: "25px" }}
        >
          If you see someone harass, troll, or spam anywhere in the Ecotenet
          community (comments, forum, etc.), notify us by flagging the offense,
          and if necessary, sending us an email at{" "}
          <Link href="mailto:info@ecotenet.org">info@ecotenet.org</Link>,
          preferably with a screen shot and URL of the offense. The moderator
          team will take any action we deem appropriate, up to and including
          banning the offender from Ecotenet.
        </Typography>
        <Typography
          variant="h6"
          sx={{ marginTop: "20px", paddingLeft: "25px" }}
        >
          Also, we do not allow machines to generate and post content (posts,
          comments, etc.) on Ecotenet with no human oversight curating each
          piece of content. Any account suspected of doing so is subject to
          suspension and the removal of the content.
        </Typography>
        <Typography
          variant="h6"
          sx={{ marginTop: "20px", paddingLeft: "25px" }}
        >
          <b>MOST IMPORTANTLY:</b> Be nice.
        </Typography>
        <Typography
          variant="h6"
          sx={{ marginTop: "20px", paddingLeft: "25px" }}
        >
          Treat everyone with respect and dignity and assume people mean well.
          Don&apos;t forget that there are real people behind the usernames.
          Ecotenet is a community including people from all backgrounds from age
          13 and up. We may share a similar interest in connecting with the
          natural environment, but that might be where our similarities end.
          Don&apos;t assume everyone shares your politics or your sense of
          humor, or even speaks your language, so try to keep things polite and
          neutral until you get to know someone. If your emotions are running
          high, maybe stepping away from your computer and letting yourself calm
          down for a while will help. If you think a piece of content is
          inappropriate or represents a violation, please flag it as such, but
          please assume people have made an honest mistake unless you have
          evidence to the contrary.
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default conduct;
