import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { getUser } from "@/services/getUser";
import type { UserBasics } from "@/types/usersBasics.type";

type UseUserOptions = Omit<UseQueryOptions<UserBasics, Error>, "queryKey" | "queryFn">;

export function useUser(userId: string | undefined, options?: UseUserOptions) {
  return useQuery<UserBasics, Error>({
    queryKey: ["user", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return getUser(userId);
    },
    enabled: !!userId, // Only fetch when userId is defined
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}
