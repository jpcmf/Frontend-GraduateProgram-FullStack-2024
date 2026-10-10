import { Box } from "@chakra-ui/react";

import type { UserBasicsWithPagination } from "@/features/user";
import { Pagination } from "@/shared/ui/New/Pagination";
import { SkaterGrid, SkatersHeader } from "@/shared/ui/New/Skaters";

interface SkatistasProps {
  users: UserBasicsWithPagination;
  currentPage: number;
  pageSize: number;
  totalUsers: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Skatistas({
  users,
  currentPage,
  pageSize,
  totalUsers,
  isLoading,
  onPageChange,
  onPageSizeChange
}: SkatistasProps) {
  const totalPages = Math.ceil(totalUsers / pageSize);

  return (
    <Box width="100%">
      <SkatersHeader
        totalUsers={totalUsers}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
      />
      <Box mt={4}>
        <SkaterGrid users={users.data} />
      </Box>
      {totalPages > 1 && (
        <Box mt={4}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        </Box>
      )}
    </Box>
  );
}
