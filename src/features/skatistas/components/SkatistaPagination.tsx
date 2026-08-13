"use client";

import { useState } from "react";

import type { UserBasicsWithPagination } from "@/features/user";
import { useUsers } from "@/features/user";

import { Skatistas } from "./Skatistas";

interface SkatistaPaginationProps {
  initialUsers: UserBasicsWithPagination;
  initialTotalUsers: number;
  initialPageSize?: number;
}

export function SkatistaPagination({
  initialUsers,
  initialTotalUsers,
  initialPageSize = 50
}: SkatistaPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const { data: paginatedUsers, isPending, isFetching, isError } = useUsers(currentPage, pageSize);

  const users = paginatedUsers?.users ?? initialUsers;
  const totalUsers = paginatedUsers?.totalFetchedUsers ?? initialTotalUsers;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  if (!users) {
    if (isError) return <div>Error loading users</div>;
    return null;
  }

  return (
    <Skatistas
      users={users}
      currentPage={currentPage}
      pageSize={pageSize}
      totalUsers={totalUsers}
      isLoading={isFetching || isPending}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}