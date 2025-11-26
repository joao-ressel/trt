import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

interface NextWebpackOptions {
  isServer: boolean;
  dev: boolean;
  dir: string;
  config: Record<string, any>;
  webpack: Record<string, any>;
  defaultLoaders: Record<string, any>;
}

const nextConfig: NextConfig = {
  webpack(config: Configuration, options: NextWebpackOptions): Configuration {
    if (options.dev) {
      console.log("Next.js PWA: Usando Webpack em modo de desenvolvimento.");
    }

    return config;
  },
};

module.exports = withPWA(nextConfig);
