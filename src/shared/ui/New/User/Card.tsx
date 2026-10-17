"use client";

import { FiGlobe, FiInstagram, FiMapPin } from "react-icons/fi";
import Link from "next/link";

import { Avatar as ChakraAvatar, Box, HStack, Stack, Text } from "@chakra-ui/react";

// type Skater = (typeof skaters)[number];
import type { UserBasics } from "@/features/user";
import { openInstagram, openWebsite } from "@/shared/lib/socialMedia";

import { Muted } from "../Muted";
// import { skaters } from "../../../../mock";
import { Panel } from "../Panel";

export const SkaterCard = ({ s }: { s: UserBasics }) => {
  return (
    <Panel variant="interactive" role="group" p={3.5}>
      <Stack align="center" textAlign="center" spacing={0.5}>
        <Box mb={2} transition="transform 0.2s" _groupHover={{ transform: "scale(1.05)" }}>
          {/* <InitialsAvatar initials={s.username} bg={s.bg} size={14} fontSize="md" /> */}
          <Link href={`/user/${s.id}`}>
            <ChakraAvatar
              // size={["lg", "lg", "xl"]}
              width="56px"
              height="56px"
              name={s?.name}
              src={s?.avatar ? s.avatar?.formats?.thumbnail?.url : undefined}
              border="2px solid transparent"
              _hover={{ cursor: "pointer", border: "2px solid", borderColor: "green.400" }}
              p={0.5}
            />
          </Link>
        </Box>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="content.primary"
          noOfLines={1}
          w="full"
          _groupHover={{ color: "accent.base" }}
        >
          {s?.name}
        </Text>
        <Muted fontSize="11px">{s?.category?.name}</Muted>
        <HStack spacing={1} mt={1} color="content.secondary" fontSize="2xs">
          <FiMapPin color="#22c55e" size={13} />
          <Text>{s?.address?.city}</Text>
        </HStack>
        <HStack
          spacing={3}
          mt={2}
          pt={2}
          w="full"
          justify="center"
          borderTop="1px solid"
          borderColor="line.faint"
          color="content.muted"
        >
          {s.instagram_url && (
            <Box
              as="button"
              aria-label={`Instagram de ${s.name}`}
              onClick={() => openInstagram(s.instagram_url)}
              _hover={{ color: "pink.400" }}
            >
              <FiInstagram size={14} />
            </Box>
          )}
          {s.website_url && (
            <Box
              as="button"
              aria-label={`Site de ${s.name}`}
              onClick={() => openWebsite(s.website_url)}
              _hover={{ color: "blue.400" }}
            >
              <FiGlobe size={14} />
            </Box>
          )}
        </HStack>
      </Stack>
    </Panel>
  );
};
