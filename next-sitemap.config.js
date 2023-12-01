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
  "/api*",
  "/approved",
  "/500",
  "/404",
  "/auth/new-user",
  "/server-sitemap",
  "/tip",
];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: exclude,
  sitemapSize: 40000,
  changefreq: "monthly",
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: exclude.concat(NEXT_SSG_FILES),
      },
      {
        userAgent: "AdsBot-Google-Mobile",
        disallow: "/",
      },
      {
        userAgent: "AdsBot-Google",
        disallow: "/",
      },
      {
        userAgent: "SemrushBot",
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: ["https://www.ecotenet.org/server-sitemap.xml"],
  },
};
