import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

import { Box, Button, Divider, Flex, HStack, Select, SimpleGrid, Spinner, Text } from "@chakra-ui/react";

import { UserCard } from "@/components/CardUser";
import type { UserBasicsWithPagination } from "@/types/UserBasicsWithPagination.type";

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
        mb="8"
        p={["2", "4"]}
        alignItems="center"
        justifyContent="start"
        flexDirection={["column", "row"]}
        gap={2}
      >
        <Flex alignItems="center">
          <Text fontSize="sm" fontWeight="normal" display={"flex"} alignItems="center" justifyContent={"center"}>
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

        <Divider borderColor="gray.700" orientation="vertical" height="8px" mx="1" />

        <Flex alignItems="center" gap={2}>
          <Text fontSize="sm">Itens por página:</Text>
          <Select
            size="xs"
            width="auto"
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            variant="flushed"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Select>
        </Flex>

        {totalPages > 1 && (
          <>
            <HStack spacing={2} marginLeft={[0, "auto"]} mt={[2, 0]}>
              <Button
                size="xs"
                onClick={handlePreviousPage}
                isDisabled={currentPage === 1 || isLoading}
                leftIcon={<TbChevronLeft size={16} />}
                variant="ghost"
                color="green.400"
                _hover={{
                  background: "transparent"
                }}
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
                rightIcon={<TbChevronRight size={16} />}
                variant="ghost"
                color="green.400"
                _hover={{
                  background: "transparent"
                }}
              >
                Próxima
              </Button>
            </HStack>
          </>
        )}
      </Flex>
    </Box>
  );
}
