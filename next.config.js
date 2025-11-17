/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.dicecho.com",
      },
    ],
  },
  experimental: {
    scrollRestoration: true,
  },

  turbopack: {
    rules: {
      "*.svg": {
        condition: {
          all: [
            { not: { path: '*.url.svg' } }, // Exclude files ending with .svg?url
            { not: 'foreign' },
          ],
        },
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default config;
