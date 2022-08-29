import { getFeatures } from "@utils/mongodb/helpers";

function generateBasicSiteMap(features) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the URLs we know already-->
     <!--POSSIBLY UPDATE, check if trailing slash is needed and if you want all these indexed-->
     <url>
       <loc>https://www.ecotenet.org/donate</loc>
     </url>
     <url>
       <loc>https://www.ecotenet.org/species-map</loc>
     </url>
     <url>
       <loc>https://www.ecotenet.org/ecoregions</loc>
     </url>
     <url>
       <loc>https://www.ecotenet.org/featured</loc>
     </url>
     <url>
       <loc>https://www.ecotenet.org/data</loc>
     </url>
     <url>
       <loc>https://www.ecotenet.org/about</loc>
     </url>
     <url>
       <loc>https://www.ecotenet.org/category</loc>
     </url>
     <url>
       <loc>https://www.ecotenet.org/terms</loc>
     </url>
     <url>
       <loc>https://www.ecotenet.org/privacy</loc>
     </url>
     <url>
       <loc>https://www.ecotenet.org/contact</loc>
     </url>
     
     
     ${features
       .map(({ _id }) => {
         return `
       <url>
           <loc>${`https://www.ecotenet.org/featured/${_id}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMapBasic() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  //   UPDATE TO CALL DATABASE

  const features = await getFeatures();
  //

  // We generate the XML sitemap with the data
  const sitemap = generateBasicSiteMap(features);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMapBasic;
