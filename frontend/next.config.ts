import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // Added for your stock logos
        port: '',
        pathname: '/**',
      },
    ],
  },
  // 👇 THIS IS CRITICAL FOR VERCEL DEPLOYMENT 👇
  async rewrites() {
    return [
      {
        source: "/api/:path*", // When frontend calls /api/...
        // REPLACE THIS URL WITH YOUR ACTUAL BACKEND VERCEL URL
        destination: "https://praedico-backend.vercel.app/api/:path*", 
      },
    ];
  },
};

export default nextConfig;