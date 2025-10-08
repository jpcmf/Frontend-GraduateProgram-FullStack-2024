import { useQuery } from "@tanstack/react-query";

import { getCustomUsersWithPagination } from "@/services/getUsers";
import { getUsersCount } from "@/services/getUsersCount";

import { UserBasicsWithPagination } from "../types/usersBasics.type";

const fetchUsers = async (
  currentPage?: number,
  pageSize?: number,
  filter?: string
): Promise<{ users: UserBasicsWithPagination; totalFetchedUsers: number }> => {
  const [userResponsePaginated, totalCountResponse2] = await Promise.all([
    getCustomUsersWithPagination(currentPage, pageSize),
    getUsersCount()
  ]);

  if (!userResponsePaginated) {
    throw new Error("Network response was not ok.");
  }

  return {
    users: userResponsePaginated,
    totalFetchedUsers: totalCountResponse2
  };
};

const useUsers = (currentPage?: number, pageSize?: number, filter?: string) => {
  return useQuery({
    queryKey: ["Users", { currentPage, pageSize, filter }],
    queryFn: () => fetchUsers(currentPage, pageSize, filter),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false
  });
};

export { fetchUsers, useUsers };
