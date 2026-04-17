import { useState } from "react";

import { Flex, Spinner } from "@chakra-ui/react";

import { Skatistas } from "@/features/skatistas";
import { useUsers } from "@/hooks/useUsers";

export function SkatistasHome() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data: paginatedUsers, isPending, isFetching, isError } = useUsers(currentPage, pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (isPending)
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );

  if (isError) return <div>Error loading users</div>;

  return (
    <Skatistas
      users={paginatedUsers?.users || []}
      currentPage={currentPage}
      pageSize={pageSize}
      totalUsers={paginatedUsers?.totalFetchedUsers || 0}
      isLoading={isFetching}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}
