"use client";

import { useState } from "react";

import { Flex, Spinner } from "@chakra-ui/react";

import type { UserBasicsWithPagination } from "@/features/user";
import { useUsers } from "@/features/user";

import { Skatistas } from "../components/Skatistas";

interface SkatistasHomeProps {
  initialUsers?: UserBasicsWithPagination;
  initialTotalUsers?: number;
}

export function SkatistasHome({ initialUsers, initialTotalUsers }: SkatistasHomeProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: paginatedUsers, isPending, isFetching, isError } = useUsers(currentPage, pageSize);

  const users = paginatedUsers?.users ?? initialUsers;
  const totalUsers = paginatedUsers?.totalFetchedUsers ?? initialTotalUsers ?? 0;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  if (!users) {
    if (isError) return <div>Error loading users</div>;
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
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