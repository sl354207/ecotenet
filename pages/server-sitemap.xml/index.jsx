import {
  getAllSpecies,
  getApprovedPeople,
  getEcoregions,
  getPosts,
} from "@utils/mongodb/mongoHelpers";
import { getServerSideSitemapLegacy } from "next-sitemap";

export const getServerSideProps = async (ctx) => {
  const siteUrl = "https://www.ecotenet.org";

  const ecoregions = await getEcoregions();
  const ecoFields = ecoregions?.map((data) => ({
    loc: `${siteUrl}/ecoregions/${data.unique_id}`,
    lastmod: new Date().toISOString(),
  }));

  const people = await getApprovedPeople();
  const peopleFields = people?.map((data) => ({
    loc: `${siteUrl}/person/${data.name}`,
    lastmod: new Date().toISOString(),
  }));

  const posts = await getPosts("published", "true");
  const postFields = posts?.map((data) => ({
    loc: `${siteUrl}/posts/${data._id.toString()}`,
    lastmod: new Date().toISOString(),
  }));
  const species = await getAllSpecies();
  const speciesFields = species?.map((data) => ({
    loc: `${siteUrl}/species/${data._id.toString()}`,
    lastmod: new Date().toISOString(),
  }));

  const fields = ecoFields.concat(peopleFields, postFields, speciesFields);

  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
