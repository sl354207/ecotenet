import { getAllSpecies, getEcoregions } from "@utils/mongodb/mongoHelpers";
import { getServerSideSitemapLegacy } from "next-sitemap";
const URLS_PER_SITEMAP = 30000;
const SITE_URL = "https://www.ecotenet.org";

export const getServerSideProps = async (ctx) => {
  if (!ctx.params?.page || isNaN(Number(ctx.params?.page))) {
    return { notFound: true };
  }
  const page = Number(ctx.params?.page);

  // // this would load the items that make dynamic pages
  // const response = await fetchDynamicPagesForSitemap({
  //   page,
  //   pageSize: URLS_PER_SITEMAP,
  // });

  // const total = response.data.pageData.total;
  // const totalSitemaps = Math.ceil(total / URLS_PER_SITEMAP);
  // const res = await getSitemapStats();
  try {
    const ecoregions = await getEcoregions();

    const species = await getAllSpecies();

    const totalSitemaps = Math.ceil(species.length / URLS_PER_SITEMAP) + 1;

    if (page > totalSitemaps - 1) {
      return { notFound: true };
    }

    // const fields = response.data.items.map(items => ({
    //   loc: `${SITE_URL}/${memorial.slug}`,
    //   lastmod: new Date().toISOString(),
    // }));
    let fields;
    if (page === 0) {
      fields = ecoregions?.map((data) => ({
        loc: `${SITE_URL}/ecoregions/${data.unique_id}`,
        changefreq: "monthly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }));
    } else {
      if (species.length / page < URLS_PER_SITEMAP) {
        const slice = species.slice((page - 1) * URLS_PER_SITEMAP);
        fields = slice?.map((data) => ({
          loc: `${SITE_URL}//species/${data._id.toString()}`,
          changefreq: "monthly",
          priority: 0.7,
          lastmod: new Date().toISOString(),
        }));
      } else {
        const slice = species.slice(
          (page - 1) * URLS_PER_SITEMAP,
          page * URLS_PER_SITEMAP
        );
        fields = slice?.map((data) => ({
          loc: `${SITE_URL}//species/${data._id.toString()}`,
          changefreq: "monthly",
          priority: 0.7,
          lastmod: new Date().toISOString(),
        }));
      }
    }
    return getServerSideSitemapLegacy(ctx, fields);
  } catch (error) {
    console.error(error);
  }

  // const people = await getApprovedPeople();
  // const peopleFields = people?.map((data) => ({
  //   loc: `${siteUrl}/person/${data.name}`,
  //   lastmod: new Date().toISOString(),
  // }));

  // const posts = await getPosts("published", "true");
  // const postFields = posts?.map((data) => ({
  //   loc: `${siteUrl}/posts/${data._id.toString()}`,
  //   lastmod: new Date().toISOString(),
  // }));
  // const species = await getAllSpecies();
  // const speciesFields = species?.map((data) => ({
  //   loc: `${siteUrl}/species/${data._id.toString()}`,
  //   lastmod: new Date().toISOString(),
  // }));

  // const fields = ecoFields.concat(peopleFields, postFields, speciesFields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
