import { useQuery } from "@tanstack/react-query";

import { getCustomUsersWithPagination } from "../services/getUsers";
import type { UserBasicsWithPagination } from "../types/UserBasicsWithPagination.type";

const fetchUsers = async (
  currentPage?: number,
  pageSize?: number,
  filter?: string
): Promise<{ users: UserBasicsWithPagination; totalFetchedUsers: number }> => {
  const page = currentPage ?? 1;
  const size = pageSize ?? 10;
  const users = await getCustomUsersWithPagination(page, size);

  if (!users) {
    throw new Error("Network response was not ok.");
  }

  return { users, totalFetchedUsers: users.meta.pagination.total };
};

const useUsers = (currentPage?: number, pageSize?: number, filter?: string) => {
  return useQuery({
    queryKey: ["users", { currentPage, pageSize, filter }],
    queryFn: () => fetchUsers(currentPage, pageSize, filter),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false
  });
};

export { fetchUsers, useUsers };
