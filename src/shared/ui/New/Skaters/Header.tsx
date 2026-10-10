"use client";

import { Box, Flex, HStack, Select, Text } from "@chakra-ui/react";

import { Muted } from "../index";
import { Panel } from "../Panel";

export const SkatersHeader = () => (
  <Panel size="lg">
    <Flex justify="space-between" align="center">
      <Box>
        <Text fontSize="md" fontWeight="bold" color="white">
          Skatistas em Destaque
        </Text>
        <Muted fontSize="sm">
          Skatistas encontrados: <b style={{ color: "white" }}>23</b>
        </Muted>
      </Box>
      <HStack spacing={2}>
        <Muted fontSize="sm">Itens por página:</Muted>
        <Select
          size="sm"
          w={16}
          variant="outline"
          bg="surface.solid"
          borderColor="line.subtle"
          borderRadius="md"
          aria-label="Itens por página"
          defaultValue="10"
        >
          <option>10</option>
          <option>20</option>
          <option>50</option>
        </Select>
      </HStack>
    </Flex>
  </Panel>
);
