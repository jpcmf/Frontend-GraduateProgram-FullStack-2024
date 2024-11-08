import {
  RiBarChartBoxLine,
  RiCashLine,
  RiChatSmile2Line,
  RiContactsLine,
  RiDashboardLine,
  RiEdit2Line,
  RiShieldStarLine
} from "react-icons/ri";
import { Stack } from "@chakra-ui/react";

import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="Geral">
        <NavLink
          icon={RiDashboardLine}
          href="/dashboard"
          _activeLink={{
            textDecoration: "none",
            color: "green.400"
          }}
        >
          Dashboard
        </NavLink>
        <NavLink
          icon={RiContactsLine}
          href="/general"
          _activeLink={{
            textDecoration: "none",
            color: "green.400"
          }}
        >
          Cadastro geral
        </NavLink>
        <NavLink
          icon={RiEdit2Line}
          href="/users"
          _activeLink={{
            textDecoration: "none",
            color: "green.400"
          }}
        >
          Campeonatos / Inscrições
        </NavLink>
        <NavLink
          icon={RiShieldStarLine}
          href="/path2"
          _activeLink={{
            textDecoration: "none",
            color: "green.400"
          }}
        >
          Clube de vantagens
        </NavLink>
        <NavLink
          icon={RiChatSmile2Line}
          href="/path3"
          _activeLink={{
            textDecoration: "none",
            color: "green.400"
          }}
        >
          Atendimento
        </NavLink>
      </NavSection>

      <NavSection title="Financeiro">
        <NavLink
          icon={RiCashLine}
          href="/path4"
          _activeLink={{
            textDecoration: "none",
            color: "green.400"
          }}
        >
          Meu histório financeiro
        </NavLink>
        <NavLink
          icon={RiBarChartBoxLine}
          href="/path5"
          _activeLink={{
            textDecoration: "none",
            color: "green.400"
          }}
        >
          Anuidades
        </NavLink>
      </NavSection>

      <NavSection title="Calendário">
        {/* <NavLink icon={RiInputMethodLine} href="/path6">
          Item 1
        </NavLink>
        <NavLink icon={RiGitMergeLine} href="/path7">
          Item 2
        </NavLink> */}
      </NavSection>
    </Stack>
  );
}
