"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { Button, HStack, Text } from "@chakra-ui/react";

import { getPageNumbers } from "@/shared/hooks/usePagination";

import { Panel } from "../Panel";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination = ({ currentPage, totalPages, onPageChange, isLoading = false }: PaginationProps) => {
  const items = getPageNumbers(currentPage, totalPages);
  const atStart = currentPage <= 1;
  const atEnd = currentPage >= totalPages;

  return (
    <Panel size="sm">
      <HStack justify="center" spacing={3} fontSize="xs">
        <Button
          variant="quiet"
          size="sm"
          leftIcon={<FiChevronLeft />}
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={isLoading || atStart}
        >
          Anterior
        </Button>

        {items.map((item, index) =>
          item === "…" ? (
            <Text key={`ellipsis-${index}`} color="content.muted" aria-hidden="true">
              …
            </Text>
          ) : (
            <Button
              key={item}
              size="sm"
              minW={6}
              h={6}
              p={0}
              variant={item === currentPage ? "accent" : "quiet"}
              onClick={() => onPageChange(item)}
              isDisabled={isLoading}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </Button>
          )
        )}

        <Button
          variant="quiet"
          size="sm"
          color="accent.base"
          rightIcon={<FiChevronRight />}
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={isLoading || atEnd}
        >
          Próxima
        </Button>
      </HStack>
    </Panel>
  );
};
