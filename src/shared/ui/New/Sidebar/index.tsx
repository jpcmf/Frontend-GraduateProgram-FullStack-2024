"use client";

import { FiGrid, FiMapPin, FiMonitor, FiUsers } from "react-icons/fi";

import { Badge, Box, Button, Divider, Flex, Grid, HStack, Icon, Stack, Tag, Text, Wrap } from "@chakra-ui/react";

import { modalities } from "../../../../mock";
import { InitialsAvatar, Muted } from "../index";
import { Panel } from "../Panel";
import { SectionLabel } from "../SectionLabel";

/* ---------------------------- Sidebar ---------------------------- */
interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: React.ReactNode;
}

const NavItem = ({ icon, label, active, badge }: NavItemProps) => (
  <Flex
    as="a"
    href="#"
    align="center"
    gap={3}
    px={3}
    py={2}
    borderRadius="lg"
    fontSize="sm"
    fontWeight={active ? 600 : 400}
    color={active ? "accent.base" : "content.secondary"}
    bg={active ? "accent.subtle" : "transparent"}
    border="1px solid"
    borderColor={active ? "accent.line" : "transparent"}
    transition="all 0.2s"
    _hover={active ? {} : { bg: "surface.raised", color: "white" }}
    aria-current={active ? "page" : undefined}
  >
    <Icon as={icon} boxSize={4} color={active ? "accent.base" : "content.muted"} />
    <Text>{label}</Text>
    {badge && <Box ml="auto">{badge}</Box>}
  </Flex>
);

const Stat = ({ value, label, accent }: { value: string; label: string; accent?: boolean }) => (
  <Stack spacing={0} align="center">
    <Text fontSize="xs" fontWeight="bold" color={accent ? "accent.base" : "white"}>
      {value}
    </Text>
    <Text fontSize="2xs" color="content.muted">
      {label}
    </Text>
  </Stack>
);

export const LeftSidebar = () => (
  <Stack as="aside" spacing={5} position={{ lg: "sticky" }} top={20} alignSelf="start">
    <Panel as="nav" size="sm">
      <SectionLabel px={3} py={2} fontSize="2xs" color="content.muted">
        Principal
      </SectionLabel>
      <Stack spacing={1}>
        <NavItem icon={FiGrid} label="Dashboard" />
        <NavItem icon={FiUsers} label="Skatistas" active badge={<Badge variant="count">23</Badge>} />
        <NavItem icon={FiMapPin} label="Spots & Picos" />
        <NavItem icon={FiMonitor} label="Truta IA" badge={<Badge variant="beta">BETA</Badge>} />
      </Stack>
    </Panel>

    <Panel>
      <Stack spacing={3}>
        <HStack spacing={3}>
          <InitialsAvatar initials="LH" ring size={12} />
          <Box overflow="hidden">
            <Text fontSize="sm" fontWeight="semibold" color="white" noOfLines={1}>
              Lucas Hens
            </Text>
            <Muted noOfLines={1}>Street / Bowl • Curitiba</Muted>
          </Box>
        </HStack>
        <Divider borderColor="line.subtle" />
        <Grid templateColumns="repeat(3, 1fr)">
          <Stat value="42" label="Drops" />
          <Stat value="1.2k" label="Kudos" accent />
          <Stat value="19" label="Picos" />
        </Grid>
        <Button variant="subtle" size="sm" w="full">
          Meu Perfil
        </Button>
      </Stack>
    </Panel>

    <Panel>
      <SectionLabel mb={3}>Modalidades</SectionLabel>
      <Wrap spacing={2}>
        {modalities.map((m, i) => (
          <Tag key={m} as="button" size="md" variant={i === 0 ? "chipActive" : "chip"}>
            {m}
          </Tag>
        ))}
      </Wrap>
    </Panel>
  </Stack>
);
