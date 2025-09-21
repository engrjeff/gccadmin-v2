import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async redirects() {
    return [
      {
        source: "/gcc-resources",
        destination: "/gcc-resources/lessons",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
