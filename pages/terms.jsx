import Footer from "@components/layouts/Footer";
import Header from "@components/layouts/Header";
import Link from "@components/layouts/Link";
import { Container, Typography } from "@mui/material";
import theme from "@utils/theme";
import { NextSeo } from "next-seo";

const terms = () => {
  return (
    <>
      <NextSeo
        title="Terms of Service"
        titleTemplate="%s | Ecotenet"
        defaultTitle="Ecotenet"
        // description="Ideas on the purpose of Ecotenet and the possible vision for the future"
        openGraph={{
          type: "Site",
          url: "https://www.ecotenet.org/terms",
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
        <Header title="Terms of Service" />
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          Welcome to the Ecotenet website (or the &quot;Site&quot;). The
          following Terms of Service govern use of the website
          https://www.ecotenet.org and any subdomains. To use the Site, you must
          agree to these terms with Ecotenet, the nonprofit company that runs
          the Site. Ecotenet may offer other products and services, under
          different terms. These terms apply only to use of the Site.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Your Permission to Use the Site</b>
        </Typography>
        <Typography variant="h6">
          Subject to these terms, Ecotenet gives you permission to use the Site.
          That permission isn&apos;t exclusive to you, and you can&apos;t
          transfer it to anyone else. Others need to agree to these terms for
          themselves to use the Site.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Conditions for Use of the Site</b>
        </Typography>
        <Typography variant="h6">
          Your permission to use the Site is subject to the following
          conditions:
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You must be at least 13 years old, unless parental permission has been
          obtained.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may no longer use the Site if Ecotenet contacts you directly to
          say that you may not.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You must use the Site in accordance with Acceptable Use and Content
          Standards.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Acceptable Use</b>
        </Typography>
        <Typography variant="h6">
          You may not break the law using the Site.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not use or try to use another&apos;s account on the Site
          without their specific permission.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not buy, sell, or otherwise trade in user names or other
          unique identifiers on the Site.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not send advertisements, chain letters, or other solicitations
          through the Site, or use the Site to gather addresses for commercial
          mailing lists.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not automate access to the Site, or monitor the Site, such as
          with a web crawler, browser plug-in or add-on, or other computer
          program that is not a web browser. You may crawl the Site to index it
          for a publicly available search engine.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not use the Site to send e-mail to distribution lists,
          newsgroups, or group mail aliases.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not falsely imply that you&apos;re affiliated with or endorsed
          by Ecotenet.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not remove any marks showing proprietary ownership from
          materials you download from the Site.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not show any part of the Site on other Sites with using
          iframes.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not disable, avoid, or circumvent any security or access
          restrictions of the Site.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not strain infrastructure of the Site with an unreasonable
          volume of requests, or requests designed to impose an unreasonable
          load on information systems underlying the Site.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not encourage or help anyone in violation of these terms.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not impersonate others through the Site.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Content Standards</b>
        </Typography>
        <Typography variant="h6">
          You may not submit content to the Site that is illegal, offensive, or
          otherwise harmful to others. This includes content that is harassing,
          inappropriate, or abusive.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not submit content to the Site that violates the law,
          infringes anyone&apos;s intellectual property rights, violates
          anyone&apos;s privacy, or breaches agreements you have with others.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not submit content to the Site containing malicious computer
          code, such as computer viruses or spyware.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not submit content to the Site as a mere placeholder, to hold
          a particular address, user name, or other unique identifier.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not use the Site to disclose information that you don&apos;t
          have the right to disclose, like others&apos; confidential
          information.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Enforcement</b>
        </Typography>
        <Typography variant="h6">
          Ecotenet may investigate and prosecute violations of these terms to
          the fullest legal extent. Ecotenet may notify and cooperate with law
          enforcement authorities in prosecuting violations of the law and these
          terms.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          Ecotenet reserves the right to change, redact, and delete content on
          the Site for any reason. If you believe someone has submitted content
          to the Site in violation of these terms, please contact us
          immediately.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Your Account</b>
        </Typography>
        <Typography variant="h6">
          You must create and log into an account to use some features of the
          Site.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          To create an account, you must provide some information about
          yourself. If you create an account, you agree to provide, at a
          minimum, a valid e-mail address, and to keep that address up-to-date.
          You may close your account at any time by logging into your account
          and clicking the button on your account dashboard page.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You agree to be responsible for all action taken using your account,
          whether authorized by you or not, until you either close your account
          or notify Ecotenet that your account has been compromised. You agree
          to notify Ecotenet immediately if you suspect your account has been
          compromised.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          Ecotenet may restrict, suspend, or close your account on the Site at
          any time, without notice to you, if Ecotenet reasonably believes that
          you&apos;ve breached these terms.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Your Content</b>
        </Typography>
        <Typography variant="h6">
          Nothing in these terms gives Ecotenet any ownership rights in
          intellectual property that you share with the Site, such as your
          account information or other content you submit to the Site. Nothing
          in these terms gives you any ownership rights in Ecotenet&apos;s
          intellectual property, either.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          Between you and Ecotenet, you remain solely responsible for content
          you submit to the Site. You agree not to wrongly imply that content
          you submit to the Site is sponsored or approved by Ecotenet. These
          terms do not obligate Ecotenet to store, maintain, or provide copies
          of content you submit.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          Content you submit to the Site belongs to you, and you decide what
          permission to give others for it. But at a minimum, you license
          Ecotenet to provide content that you submit to the Site to other users
          of the Site. That special license allows Ecotenet to copy, publish,
          and analyze content you submit to the Site.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          When content you submit is removed from the Site, whether by you or by
          Ecotenet, Ecotenet&apos;s special license ends when the last copy
          disappears from Ecotenet&apos;s backups, caches, and other systems.
          Other licenses you apply to content you submit may continue after your
          content is removed. Those licenses may give others, or Ecotenet
          itself, the right to share your content through the Site again.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          Others who receive content you submit to the Site may violate the
          terms on which you license your content. You agree that Ecotenet will
          not be liable to you for those violations or their consequences.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Your Responsibility</b>
        </Typography>
        <Typography variant="h6">
          You agree to indemnify Ecotenet from legal claims by others related to
          your breach of these terms, or breach of these terms by others using
          your account on the Site. Both you and Ecotenet agree to notify the
          other side of any legal claims for which you might have to indemnify
          Ecotenet as soon as possible.
          {/* If Ecotenet fails to notify you of a
          legal claim promptly, you won&apos;t have to indemnify Ecotenet for
          damages that you could have defended against or mitigated with prompt
          notice.  */}
          You agree to allow Ecotenet to control investigation, defense, and
          settlement of legal claims for which you would have to indemnify
          Ecotenet, and to cooperate with those efforts. Ecotenet agrees not to
          agree to any settlement that admits fault for you or imposes
          obligations on you without your prior agreement.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Disclaimers</b>
        </Typography>
        <Typography variant="h6">
          You accept all risk of using the Site and content on the Site. As far
          as the law allows, Ecotenet provides the Site as is, without any
          warranty whatsoever.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          The Site may hyperlink to and integrate Sites and services run by
          others. Ecotenet does not make any warranty about services run by
          others, or content they may provide. Use of services run by others may
          be governed by other terms between you and the one running the
          service.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          A more detailed disclaimer regarding the accuracy, adequacy, validity,
          reliability, availability, or completeness of any of the Site&apos;s
          content or any external links they may contain can be found{" "}
          <Link
            href="https://www.ecotenet.org/dislaimer"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </Link>
          .
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Limits on Liability</b>
        </Typography>
        <Typography variant="h6">
          Ecotenet will not be liable to you for breach-of-contract damages
          Ecotenet personnel could not have reasonably foreseen when you agreed
          to these terms.
        </Typography>
        {/* <Typography variant="h6" sx={{ marginTop: "10px" }}>
          As far as the law allows, Ecotenet&apos;s total liability to you for
          claims of any kind that are related to the Site or content on the
          Site will be limited to $50.
        </Typography> */}
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          In no event will Ecotenet be liable with respect to any subject matter
          of this Terms of Service under any contract, negligence, strict
          liability or other legal or equitable theory for: (i) any special,
          incidental or consequential damages; (ii) the cost of procurement or
          substitute products or services; or (iii) for interruption of use or
          loss or corruption of data. Ecotenet shall have no liability for any
          failure or delay due to matters beyond its reasonable control. The
          foregoing shall not apply to the extent prohibited by applicable law.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Indemnification</b>
        </Typography>
        <Typography variant="h6">
          You agree to indemnify and hold harmless Ecotenet, their contractors,
          licensors, and their respective directors, officers, employees and
          agents from and against any and all claims and expenses, including
          attorneys&apos; fees, arising out of your use of the Site, including
          but not limited to your violation of this Terms of Service.
        </Typography>
        {/* UPDATE */}
        {/* <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Copyright Infringement and DMCA Policy</b>
        </Typography>
        <Typography variant="h6">
          Notification and counter notification stuff.
        </Typography> */}
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Feedback</b>
        </Typography>
        <Typography variant="h6">
          Ecotenet welcomes your feedback and suggestions for the Site. See the
          Contact section below for ways to get in touch with us.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You agree that Ecotenet will be free to act on feedback and
          suggestions you provide, and that Ecotenet won&apos;t have to notify
          you that your feedback was used, get your permission to use it, or pay
          you. You agree not to submit feedback or suggestions that you believe
          might be confidential or proprietary, to you or others.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Termination</b>
        </Typography>
        <Typography variant="h6">
          Either you or Ecotenet may end the agreement written out in these
          terms at any time. When our agreement ends, your permission to use the
          Site also ends.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          The following provisions survive the end of our agreement: Your
          Content, Feedback, Your Responsibility, Disclaimers, Limits on
          Liability, and General Terms.
        </Typography>
        {/* <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Disputes</b>
        </Typography>
        <Typography variant="h6">
          Ohio law will govern any dispute, including any legal proceedings,
          related to these terms or your use of the Site.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You and Ecotenet agree to seek injunctions related to these terms only
          in state or federal court in Athens, Ohio. Neither you nor Ecotenet
          will object to jurisdiction, forum, or venue in those courts.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          Other than to seek an injunction or for claims under the Computer
          Fraud and Abuse Act, you and Ecotenet will resolve any Dispute by
          binding American Arbitration Association arbitration. Arbitration will
          follow the AAA&apos;s Commercial Arbitration Rules and Supplementary
          Procedures for Consumer Related Disputes. Arbitration will happen in
          Athens, Ohio. You will settle any dispute as an individual, and not as
          part of a class action or other representative proceeding, whether as
          the plaintiff or a class member. No arbitrator will consolidate any
          dispute with any other arbitration without Ecotenet&apos;s permission.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          Any arbitration award will include costs of the arbitration,
          reasonable attorneys&apos; fees, and reasonable costs for witnesses.
          You or Ecotenet may enter arbitration awards in any court with
          jurisdiction.
        </Typography> */}
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>General Terms</b>
        </Typography>
        <Typography variant="h6">
          If a provision of these terms is unenforceable as written, but could
          be changed to make it enforceable, that provision should be modified
          to the minimum extent necessary to make it enforceable. Otherwise,
          that provision should be removed.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          You may not assign your agreement with Ecotenet. Ecotenet may assign
          your agreement to any affiliate of Ecotenet, any other company that
          obtains control of Ecotenet, or any other company that buys assets of
          Ecotenet related to the Site. Any attempted assignment against these
          terms has no legal effect.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          Neither the exercise of any right under this Agreement, nor waiver of
          any breach of this Agreement, waives any other breach of this
          Agreement.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          These terms embody all the terms of agreement between you and Ecotenet
          about use of the Site. These terms entirely replace any other
          agreements about your use of the Site, written or not.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Contact</b>
        </Typography>
        <Typography variant="h6">
          You may notify Ecotenet under these terms, and send questions to
          Ecotenet, at{" "}
          <Link href="mailto:info@ecotenet.org">info@ecotenet.org</Link>
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          Ecotenet may notify you under these terms using the e-mail address you
          provide for your account on the Site, or by posting a message on the
          Site or in your dashboard notifications.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          <b>Changes</b>
        </Typography>
        <Typography variant="h6">
          Ecotenet last updated these terms on November 27, 2023, and may update
          these terms again. Ecotenet will post all updates to the Site. For
          updates that contain substantial changes, Ecotenet agrees to e-mail
          you, if you&apos;ve created an account and provided a valid e-mail
          address. Ecotenet may also announce updates with special messages or
          alerts on the Site.
        </Typography>
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
          Once you get notice of an update to these terms, you must agree to the
          new terms in order to keep using the Site.
        </Typography>
        <Typography variant="subtitle2" sx={{ marginTop: "20px" }}>
          This Terms of Service has been adapted from{" "}
          <Link
            href="https://www.freecodecamp.org/news/terms-of-service/"
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            freecodecamp
          </Link>{" "}
          and{" "}
          <Link
            href="https://www.inaturalist.org/pages/terms"
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

export default terms;
