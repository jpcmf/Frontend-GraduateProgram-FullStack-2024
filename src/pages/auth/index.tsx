import { useRouter } from "next/router";

export default function Auth() {
  const router = useRouter();

  if (typeof window !== "undefined") {
    router.push("/");
  }
}
