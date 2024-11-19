import { NextApiRequest, NextApiResponse } from "next";

const baseUrl = "https://skatehub.vercel.app/";

const routes = [
  { url: "", changeFrequency: "monthly", priority: 1 },
  { url: "dashboard", changeFrequency: "monthly", priority: 0.8 },
  { url: "auth/signup", changeFrequency: "monthly", priority: 0.8 }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sitemap = routes
    .map(
      ({ url, changeFrequency, priority }) => `
    <url>
      <loc>${baseUrl}${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${changeFrequency}</changefreq>
      <priority>${priority}</priority>
    </url>
  `
    )
    .join("");

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemap}
    </urlset>
  `);
}
