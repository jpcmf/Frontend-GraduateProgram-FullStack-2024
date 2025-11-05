import { useRouter } from "next/router";

import { UserProfile } from "@/features/user/profile";

export default function SkateHubProfilePage() {
  const router = useRouter();
  return <UserProfile userId={router.query.id as string} />;
}
