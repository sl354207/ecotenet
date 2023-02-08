module.exports = {
  // experimental: {
  //   images: {
  //     remotePatterns: [
  //       {
  //         // protocol: 'https',
  //         hostname: "**",
  //         // port: '',
  //         pathname: "**",
  //       },
  //     ],
  //   },
  // },
  // reactStrictMode: true,
  images: {
    domains: [
      "eco-media-bucket.s3.us-east-2.amazonaws.com",
      "res.cloudinary.com",
      "upload.wikimedia.org",
    ],
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    dirs: ["pages", "components", "utils"], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
};
