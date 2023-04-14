const SITE_URL = process.env.SITE_URL || "https://www.ecotenet.org";

const NEXT_SSG_FILES = [
  "/*.json$",
  "/*_buildManifest.js$",
  "/*_middlewareManifest.js$",
  "/*_ssgManifest.js$",
  "/*.js$",
];

const exclude = [
  "/dashboard*",
  "/admin*",
  "/featured*",
  "/api*",
  "/approved",
  "/500",
  "/404",
  "/auth/new-user",
  "/server-sitemap.xml",
];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: exclude,
  sitemapSize: 25000,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        userAgent: "AdsBot-Google-Mobile",
        userAgent: "AdsBot-Google",
        disallow: exclude,
      },
      {
        userAgent: "*",
        disallow: NEXT_SSG_FILES,
      },
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: ["https://www.ecotenet.org/server-sitemap.xml"],
    additionalPaths: async (config) => {
      const result = [];

      result.push({
        loc: "/donate",
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: "/ecoregions",
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: "/data",
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: "/about",
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: "/category",
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: "/terms",
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: "/privacy",
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: "/contact",
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: "/how",
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: "/ideas",
        lastmod: new Date().toISOString(),
      });
      result.push({
        loc: "/featured",
        lastmod: new Date().toISOString(),
      });

      return result;
    },
  },
};
