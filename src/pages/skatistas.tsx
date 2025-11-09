import { useState } from "react";

import { TitleSection } from "@/components/TitleSection";
import { Skatistas } from "@/features/skatistas";
import { useUsers } from "@/hooks/useUsers";

export default function SkatistasPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: paginatedUsers, isPending, isFetching, isError } = useUsers(currentPage, pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading users</div>;

  return (
    <>
      <TitleSection title="Skatistas" />
      <Skatistas
        users={paginatedUsers?.users || []}
        currentPage={currentPage}
        pageSize={pageSize}
        totalUsers={paginatedUsers?.totalFetchedUsers || 0}
        isLoading={isFetching}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}
