"use client";

import { Box, Flex, HStack, Select, Text } from "@chakra-ui/react";

import { Muted } from "../Muted";
import { Panel } from "../Panel";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

interface SkatersHeaderProps {
  totalUsers: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}

export const SkatersHeader = ({ totalUsers, pageSize, onPageSizeChange, isLoading = false }: SkatersHeaderProps) => (
  <Panel size="md">
    <Flex justify="space-between" align="center" gap={4} wrap="wrap">
      <Box>
        <Text fontSize="sm" fontWeight="bold" color="white" letterSpacing="tight">
          Skatistas em Destaque
        </Text>
        <Muted fontSize="xs">
          {isLoading ? (
            "Carregando…"
          ) : (
            <>
              Skatistas encontrados: <b style={{ color: "white" }}>{totalUsers}</b>
            </>
          )}
        </Muted>
      </Box>
      <HStack spacing={2}>
        <Muted fontSize="xs">Itens por página:</Muted>
        <Select
          size="xs"
          w={16}
          variant="outline"
          bg="surface.solid"
          borderColor="line.subtle"
          borderRadius="md"
          aria-label="Itens por página"
          value={pageSize}
          onChange={event => onPageSizeChange(Number(event.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      </HStack>
    </Flex>
  </Panel>
);
