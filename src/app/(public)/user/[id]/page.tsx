"use client";

import { use } from "react";

import { UserProfile } from "@/features/user/profile";

type UserProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function UserProfilePage(props: UserProfilePageProps) {
  const params = use(props.params);
  const { id } = params;

  if (!id) {
    return null;
  }

  return <UserProfile userId={id} />;
}
