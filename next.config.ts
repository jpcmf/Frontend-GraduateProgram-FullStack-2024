import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // These OTel packages patch Node.js modules at runtime; Turbopack must not
  // try to bundle them — let Node.js resolve them from node_modules directly.
  serverExternalPackages: ["import-in-the-middle", "require-in-the-middle"],
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

export default withSentryConfig(nextConfig, {
  // Sentry org / project — set via env vars to keep this file secret-free
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps when a real auth token is present (skipped in local dev)
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Suppress the Sentry CLI output during builds
  silent: !process.env.CI,

  // Upload source maps to Sentry so stack traces are readable
  widenClientFileUpload: true
});
