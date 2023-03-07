// update
// default-src 'self';
//   script-src 'self';
//   child-src example.com;
//   style-src 'self' example.com;
//   font-src 'self';
// const ContentSecurityPolicy = `
// default-src 'none';
// font-src https://fonts.googleapis.com;
// img-src *;
// object-src 'none';
// script-src 'self' 'unsafe-eval';
// style-src 'self';
// frame-ancestors 'self';
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

  {
    key: "Content-Security-Policy",
    value:
      "default-src 'none'; font-src https://fonts.gstatic.com; img-src *; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; frame-ancestors 'self'; require-trusted-types-for 'script'",
  },
];

module.exports = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // filter dropdowns, editor and dialogs don't open when true
  reactStrictMode: true,
  images: {
    domains: ["eco-media-bucket.s3.us-east-2.amazonaws.com"],
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    dirs: ["pages", "components", "utils"], // Only run ESLint on the 'pages', 'components' and 'utils' directories during production builds (next build)
  },
};
