import type { Metadata } from "next";

import { getSkatistasServer, SkatistaPagination } from "@/features/skatistas";

export const metadata: Metadata = {
  title: "Skatistas — SkateHub",
  description: "Conheça os skatistas da comunidade SkateHub",
  alternates: { canonical: "https://skatehub.vercel.app/skatistas" },
  openGraph: {
    title: "Skatistas — SkateHub",
    description: "Conheça os skatistas da comunidade SkateHub",
    url: "https://skatehub.vercel.app/skatistas",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Skatistas — SkateHub",
    description: "Conheça os skatistas da comunidade SkateHub"
  }
};

export default async function SkatistasPage() {
  const { users, totalFetchedUsers } = await getSkatistasServer(1, 50);

  return <SkatistaPagination initialUsers={users} initialTotalUsers={totalFetchedUsers} initialPageSize={50} />;
}
