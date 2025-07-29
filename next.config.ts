import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental : {
    serverActions : {
      bodySizeLimit : '25mb', // Increase body size limit for file uploads
    }
  }
};

export default nextConfig;
