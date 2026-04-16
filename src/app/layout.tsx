import type { Metadata } from "next";

import { fonts } from "@/lib/fonts";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SkateHub",
  description: "Social platform for the skateboarding community"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%", margin: 0, padding: 0 }}>
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
            #__next {
              display: flex;
              flex-direction: column;
              height: 100dvh;
            }
          `
          }}
        />
      </head>
      <body style={{ height: "100%", margin: 0, padding: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
