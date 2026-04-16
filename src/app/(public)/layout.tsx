import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SkateHub - Comunidade de Skatistas",
  description: "Descubra spots de skate, conecte-se com skatistas e compartilhe suas experiências."
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
