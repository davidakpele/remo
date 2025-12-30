import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler:true,
  experimental:{
    turbopackFileSystemCacheForDev: true,
    turbopackClientSideNestedAsyncChunking: true
  }
};

export default nextConfig;
