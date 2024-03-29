import { getSitemapStats } from "@utils/mongodb/mongoHelpers";
import { getServerSideSitemapIndexLegacy } from "next-sitemap";

const URLS_PER_SITEMAP = 20000;

export const getServerSideProps = async (ctx) => {
  try {
    const res = await getSitemapStats();
    const count = res.species + res.ecoregions;

    const totalSitemaps = Math.ceil(count / URLS_PER_SITEMAP) + 1;

    const sitemaps = Array(totalSitemaps)
      .fill("")
      .map(
        (v, index) => `https://www.ecotenet.org/server-sitemap-${index}.xml`
      );

    return getServerSideSitemapIndexLegacy(ctx, sitemaps);
  } catch (error) {
    console.error(error);
  }
};

// Default export to prevent Next.js errors
export default function SitemapIndex() {}
