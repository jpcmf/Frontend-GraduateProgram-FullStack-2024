import { Metadata } from "next";

import { UserEdit } from "@/features/user/edit";

export const metadata: Metadata = {
  title: "Editar Perfil - SkateHub"
};

export default function UserEditPage() {
  return <UserEdit />;
}
