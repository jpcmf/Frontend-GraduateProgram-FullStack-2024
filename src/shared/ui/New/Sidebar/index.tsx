"use client";

import { useContext } from "react";
import { FiCoffee, FiCpu, FiMapPin, FiUsers } from "react-icons/fi";

import { Badge, Box, Button, Divider, Grid, HStack, Stack, Tag, Text, Wrap } from "@chakra-ui/react";

import { AuthContext } from "@/features/auth";

import { modalities } from "../../../../mock";
import { InitialsAvatar } from "../InitialsAvatar";
import { Muted } from "../Muted";
import { NavLink } from "../NavLink";
import { Panel } from "../Panel";
import { SectionLabel } from "../SectionLabel";

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

export function LeftSidebar() {
  const { user, isAuthenticated } = useContext(AuthContext);
  return (
    <Stack as="aside" spacing={5} position={{ lg: "sticky" }} top={20} alignSelf="start">
      <Panel as="nav" size="sm">
        <SectionLabel px={3} py={2} fontSize="2xs" color="content.muted">
          Principal
        </SectionLabel>
        <Stack spacing={1}>
          <NavLink
            icon={FiCoffee}
            href="/"
            _activeLink={{
              textDecoration: "none",
              color: "green.400"
            }}
            label="Feed"
          />
          <NavLink
            icon={FiUsers}
            href="/skatistas"
            _activeLink={{
              textDecoration: "none",
              color: "green.400"
            }}
            label="Skatistas"
            badge={<Badge variant="count">23</Badge>}
          />
          <NavLink
            icon={FiMapPin}
            href="/spots"
            _activeLink={{
              textDecoration: "none",
              color: "green.400"
            }}
            label="Spots & Picos"
          />
          <NavLink
            icon={FiCpu}
            href="/ai"
            _activeLink={{
              textDecoration: "none",
              color: "green.400"
            }}
            label="Truta IA"
            badge={<Badge variant="beta">BETA</Badge>}
          />
        </Stack>
      </Panel>

      {/* {isAuthenticated && (
        <Panel as="nav" size="sm">
          <SectionLabel px={3} py={2} fontSize="2xs" color="content.muted">
            Usuário
          </SectionLabel>
          <Stack spacing={3}>
            <NavItem icon={FiSettings} label="Configurações" />
          </Stack>
        </Panel>
      )} */}

      {isAuthenticated && (
        <Panel>
          <Stack spacing={3}>
            <HStack spacing={3}>
              <InitialsAvatar
                initials={user?.name
                  ?.split(" ")
                  .map(n => n[0])
                  .join("")}
                ring
                size={12}
              />
              <Box overflow="hidden">
                <Text fontSize="sm" fontWeight="semibold" color="white" noOfLines={1}>
                  {user?.name}
                </Text>
                <Muted noOfLines={1}>{user?.category?.name}</Muted>
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
            <Button onClick={() => (window.location.href = "/dashboard")} variant="subtle" size="sm" w="full">
              Meu Dashboard
            </Button>
          </Stack>
        </Panel>
      )}

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
}
