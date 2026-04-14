import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "127.0.0.1" },
      { hostname: "strapi-production-b6f4.up.railway.app" },
      { hostname: "res.cloudinary.com" }
    ]
  },
  rewrites: async () => {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap"
      }
    ];
  }
};

module.exports = nextConfig;
