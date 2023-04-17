import { getSitemapStats } from "@utils/mongodb/mongoHelpers";
import { getServerSideSitemapIndexLegacy } from "next-sitemap";

const URLS_PER_SITEMAP = 40000;

export const getServerSideProps = async (ctx) => {
  // obtain the count hitting an API endpoint or checking the DB
  const res = await getSitemapStats();
  const count = res.species + res.ecoregions;
  const totalSitemaps = Math.ceil(count / URLS_PER_SITEMAP);

  const sitemaps = Array(totalSitemaps)
    .fill("")
    .map((v, index) => `https://www.ecotenet.org/server-sitemap-${index}.xml`);

  return getServerSideSitemapIndexLegacy(ctx, sitemaps);
};

// Default export to prevent Next.js errors
export default function SitemapIndex() {}
