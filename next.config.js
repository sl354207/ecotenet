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
  images: {
    domains: [
      "eco-media-bucket.s3.us-east-2.amazonaws.com",
      "res.cloudinary.com",
      "upload.wikimedia.org",
    ],
  },
  eslint: {
    dirs: ["pages", "components", "utils"], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
};
