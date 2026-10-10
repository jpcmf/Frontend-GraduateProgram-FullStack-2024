"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { Button, HStack } from "@chakra-ui/react";

import { Panel } from "../Panel";

export const Pagination = ({ current = 1, pages = 3 }: { current?: number; pages?: number }) => (
  <Panel size="sm">
    <HStack justify="center" spacing={3} fontSize="xs">
      <Button variant="quiet" size="sm" leftIcon={<FiChevronLeft />}>
        Anterior
      </Button>
      {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
        <Button
          key={n}
          size="sm"
          minW={6}
          h={6}
          p={0}
          variant={n === current ? "accent" : "quiet"}
          aria-current={n === current ? "page" : undefined}
        >
          {n}
        </Button>
      ))}
      <Button variant="quiet" size="sm" color="accent.base" rightIcon={<FiChevronRight />}>
        Próxima
      </Button>
    </HStack>
  </Panel>
);
