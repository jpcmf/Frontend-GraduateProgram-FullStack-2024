"use client";

import { Box, Center, Flex, HStack, Link, Stack, Text } from "@chakra-ui/react";

import { communities } from "../../../../mock";
import { Muted } from "../Muted";
import { Panel } from "../Panel";
import { SectionLabel } from "../SectionLabel";

export const Communities = () => (
  <Panel>
    <Flex justify="space-between" align="center" mb={3}>
      <SectionLabel>Comunidades & Picos</SectionLabel>
      <Link href="#" fontSize="xs" fontWeight="semibold" color="accent.base">
        Ver todos
      </Link>
    </Flex>
    <Stack spacing={1}>
      {communities.map(c => (
        <HStack
          key={c.code}
          as="a"
          href="#"
          spacing={3}
          p={2}
          borderRadius="lg"
          transition="background 0.2s"
          _hover={{ bg: "surface.raised" }}
        >
          <Center
            w={8}
            h={8}
            borderRadius="lg"
            fontSize="xs"
            fontWeight="bold"
            bg={`${c.color}.600`}
            color={`${c.color}.300`}
            border="1px solid"
            borderColor={`${c.color}.500`}
            sx={{ bg: `color-mix(in srgb, var(--chakra-colors-${c.color}-600) 30%, transparent)` }}
          >
            {c.code}
          </Center>
          <Box overflow="hidden">
            <Text fontSize="xs" fontWeight="semibold" color="white" noOfLines={1}>
              {c.name}
            </Text>
            <Muted fontSize="2xs">{c.info}</Muted>
          </Box>
        </HStack>
      ))}
    </Stack>
  </Panel>
);
