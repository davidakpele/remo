import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      }
    ]
  },
  experimental: {
    appNavFailHandling: false,
    turbopackFileSystemCacheForDev: true,
    turbopackClientSideNestedAsyncChunking: true
  }
};

export default nextConfig;