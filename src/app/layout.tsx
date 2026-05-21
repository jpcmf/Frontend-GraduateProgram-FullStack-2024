import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { fonts } from "@/shared/lib/fonts";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SkateHub",
  description: "Social platform for the skateboarding community"
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="N5AS_Y5dpIzozQKynw_S6M24hl_0hqHhpsA-SrQuZ-g" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --font-roboto: ${fonts.roboto.style.fontFamily};
              --font-raleway: ${fonts.raleway.style.fontFamily};
            }
            html, body {
              height: 100%;
              margin: 0;
              padding: 0;
            }
          `
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        {/*
          Vercel Speed Insights: Real User Monitoring for Core Web Vitals.
          Measures LCP, CLS, INP, FCP, TTFB from real users on real devices.
          Data visible in: Vercel dashboard → Analytics → Speed Insights
          Cost: free on Hobby plan, unlimited data points, 1-month retention.
        */}
        <SpeedInsights />
        {/*
          Vercel Analytics: page view tracking per route.
          Data visible in: Vercel dashboard → Analytics
          Cost: free on Hobby plan, 50K events/month, 1-month retention.
        */}
        <Analytics />
      </body>
    </html>
  );
}
