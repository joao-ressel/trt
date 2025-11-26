import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === "development";
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: !isProd,
});

module.exports = withPWA({
  reactStrictMode: true,
});
