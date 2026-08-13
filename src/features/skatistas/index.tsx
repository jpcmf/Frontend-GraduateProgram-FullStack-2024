import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

import { Box, Button, Flex, HStack, Select, SimpleGrid, Spinner, Text } from "@chakra-ui/react";

import type { UserBasicsWithPagination } from "@/features/user";
import { useColors } from "@/shared/hooks/useColors";
import { UserCard } from "@/shared/ui/CardUser";

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
  const { bgColor } = useColors();
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
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

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
      <Flex>
        <Flex alignItems="center" mb={4}>
          <Text
            as="div"
            fontSize="sm"
            fontWeight="normal"
            display={"flex"}
            alignItems="center"
            justifyContent={"center"}
          >
            {isLoading ? (
              <Flex alignItems="center">
                <Spinner size="xs" mr={2} />
                Carregando...
              </Flex>
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
        <Flex alignItems="center" gap={2} mb={4} marginLeft={{ base: "auto", md: "auto" }}>
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
      </Flex>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, xl: 6 }} spacing={{ base: 5, lg: 4 }} w="100%" mb={6}>
        {users.data.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </SimpleGrid>

      {totalPages > 1 && (
        <Flex
          bg={bgColor}
          borderRadius={8}
          p={["2", "4"]}
          alignItems="center"
          justifyContent="center"
          flexDirection={{ base: "column-reverse", md: "row" }}
          gap={2}
        >
          <>
            <HStack spacing={2}>
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
        </Flex>
      )}
    </Box>
  );
}
