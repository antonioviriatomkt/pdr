import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:lang/journal/article/:slug',
        destination: '/:lang/journal/:slug',
        permanent: true,
      },
      {
        source: '/:lang/journal/category/new-developments',
        destination: '/:lang/journal/category/market-intelligence',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;
