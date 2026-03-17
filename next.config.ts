import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/crowdfunding-bucket/**',
      },
      {
        protocol: 'https',
        hostname: 'minio-api.081246.xyz',
        pathname: '/crowdfunding-bucket/**',
      },
    ],
  },
};

export default nextConfig;
