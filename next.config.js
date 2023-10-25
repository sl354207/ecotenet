const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
// const ContentSecurityPolicy = `
// child-src 'self' https://www.youtube-nocookie.com;
// require-trusted-types-for 'script'
// `;

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), usb=()",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // POSSIBLY UPDATE MORE FOR STRIPE TO WORK AND VERCEL FEEDBACK AND BE MORE SPECIFIC WITH URLS
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; font-src 'self' https://fonts.gstatic.com; img-src https: data: blob: http://upload.wikimedia.org; script-src 'self' https://vercel.live/_next-live/feedback/feedback.js https://api.mapbox.com https://js.stripe.com  'unsafe-eval'; script-src-elem 'self' https://www.youtube.com https://connect.facebook.net/en_US/sdk.js https://player.twitch.tv/js/embed/v1.js https://player.vimeo.com/api/player.js https://api.dmcdn.net/all.js https://www.facebook.com/v3.3/plugins/video.php 'unsafe-eval'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; object-src 'none';  connect-src  'self' *.pusher.com *.pusherapp.com ws://ws-us2.pusher.com https://safebrowsing.googleapis.com/v4/ https://en.wikipedia.org https://api.mapbox.com https://events.mapbox.com https://eco-media-bucket.s3.us-east-2.amazonaws.com https://tfhub.dev/tensorflow/tfjs-model/toxicity/1/default/1/model.json https://tfhub.dev/tensorflow/tfjs-model/toxicity/1/default/1/  https://storage.googleapis.com/tfjs-models/savedmodel/universal_sentence_encoder/vocab.json https://d1zv2aa70wpiur.cloudfront.net/tfjs_quant_nsfw_mobilenet/model.json https://d1zv2aa70wpiur.cloudfront.net/tfjs_quant_nsfw_mobilenet/group1-shard1of1 https://vimeo.com; worker-src 'self' blob:; frame-src https: https://js.stripe.com/ https://www.youtube-nocookie.com/; frame-ancestors 'self'; base-uri 'self'; form-action 'self';",
  },
];

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      /* development only config options here */
      async headers() {
        return [
          {
            // Apply these headers to all routes in your application.
            source: "/:path*",
            headers: securityHeaders,
          },
        ];
      },
      poweredByHeader: false,

      // filter dropdowns, editor and dialogs don't open when true
      reactStrictMode: false,
      images: {
        domains: ["eco-media-bucket.s3.us-east-2.amazonaws.com"],
        formats: ["image/avif", "image/webp"],
      },
      eslint: {
        dirs: ["pages", "components", "utils"], // Only run ESLint on the 'pages', 'components' and 'utils' directories during production builds (next build)
      },
    };
  }

  return {
    /* config options for all phases except development here */
    async headers() {
      return [
        {
          // Apply these headers to all routes in your application.
          source: "/:path*",
          headers: securityHeaders,
        },
      ];
    },
    poweredByHeader: false,

    // filter dropdowns, editor and dialogs don't open when true
    reactStrictMode: true,
    images: {
      domains: ["eco-media-bucket.s3.us-east-2.amazonaws.com"],
      formats: ["image/avif", "image/webp"],
    },
    eslint: {
      dirs: ["pages", "components", "utils"], // Only run ESLint on the 'pages', 'components' and 'utils' directories during production builds (next build)
    },
    rewrites: async () => [
      {
        source: "/server-sitemap.xml",
        destination: "/server-sitemap",
      },
      {
        source: "/server-sitemap-:page.xml",
        destination: "/server-sitemap/:page",
      },
    ],
  };
};
