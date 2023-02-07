// UPDATE, CHECK _DOCUMENT.JS
import Head from "next/head";

// add meta data props into Meta tag
const Meta = ({ title, keywords, description }) => {
  // UPDATE
  return (
    // Head tag is default head in next
    <Head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />

      <title>{title}</title>
    </Head>
  );
};

// set default meta props
Meta.defaultProps = {
  title: "ecotenet",
  keywords: "eco",
  description: "eco site",
};

export default Meta;
