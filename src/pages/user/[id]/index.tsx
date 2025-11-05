import { useRouter } from "next/router";

import { UserProfile } from "@/features/user/profile";

export default function SkateHubProfilePage() {
  const router = useRouter();

  if (!router.isReady || typeof router.query.id !== "string") {
    return null;
  }

  return <UserProfile userId={router.query.id} />;
}
