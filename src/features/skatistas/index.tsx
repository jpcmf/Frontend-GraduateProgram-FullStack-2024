import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

import { Box, Button, Flex, HStack, Select, SimpleGrid, Spinner, Text } from "@chakra-ui/react";

import { UserCard } from "@/components/CardUser";
import type { UserBasicsWithPagination } from "@/types/usersBasics.type";

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
  // const startItem = currentPage;
  // const endItem = Math.min(currentPage * pageSize, totalUsers);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Box width={"100%"}>
      <SimpleGrid columns={{ sm: 3, md: 4, lg: 5 }} spacing={{ base: 5, lg: 4 }} w="100%" mb={6}>
        {users.data.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </SimpleGrid>

      <Flex
        bg="gray.800"
        borderRadius={8}
        mb="4"
        p={["2", "4"]}
        alignItems="center"
        justifyContent="space-between"
        flexDirection={["column", "row"]}
        gap={2}
      >
        <Flex alignItems="center">
          <Text fontSize="sm" fontWeight="semibold" display={"flex"} alignItems="center" justifyContent={"center"}>
            {isLoading ? (
              <Text as="span" alignItems="center">
                <Spinner size="xs" mr={2} />
                Carregando...
              </Text>
            ) : (
              <>
                Skatistas encontrados:{" "}
                <Text as="span" ml={1} fontWeight="bold">
                  {totalUsers}
                </Text>
              </>
            )}
          </Text>
        </Flex>

        <Flex alignItems="center" gap={2}>
          <Text fontSize="sm">Itens por página:</Text>
          <Select
            size="sm"
            width="auto"
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            bg="gray.700"
            borderColor="gray.600"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Select>
        </Flex>
      </Flex>

      {totalPages > 1 && (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          bg="gray.800"
          borderRadius={8}
          p={4}
          flexDirection={["column", "row"]}
          gap={4}
        >
          <Text fontSize="sm" color="gray.400">
            Página {currentPage} de {totalPages}
          </Text>

          <HStack spacing={2}>
            <Button
              size="xs"
              onClick={handlePreviousPage}
              isDisabled={currentPage === 1 || isLoading}
              leftIcon={<TbChevronLeft />}
              variant="ghost"
              color="green.400"
            >
              Anterior
            </Button>

            {generatePageNumbers().map(pageNum => (
              <Button
                key={pageNum}
                size="xs"
                onClick={() => onPageChange(pageNum + 1)}
                isDisabled={isLoading}
                variant={pageNum === currentPage - 1 ? "ghost" : "ghost"}
                color={pageNum === currentPage - 1 ? "green.400" : "green.700"}
              >
                {pageNum + 1}
              </Button>
            ))}

            <Button
              size="xs"
              onClick={handleNextPage}
              isDisabled={currentPage >= totalPages || isLoading}
              rightIcon={<TbChevronRight />}
              variant="ghost"
              color="green.400"
            >
              Próxima
            </Button>
          </HStack>
        </Flex>
      )}
    </Box>
  );
}
