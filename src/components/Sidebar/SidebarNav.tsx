import { useContext } from "react";
import { RiContactsLine, RiDashboardLine, RiPencilRulerFill, RiPinDistanceLine } from "react-icons/ri";
import { TbUsers } from "react-icons/tb";

import { Box, Stack, useColorModeValue } from "@chakra-ui/react";

import { AuthContext } from "@/contexts/AuthContext";

import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
  const { isAuthenticated } = useContext(AuthContext);
  const bgColor = useColorModeValue("blackAlpha.100", "gray.800");
  return (
    <Box bg={bgColor} p="6" borderRadius={0} h="full">
      <Stack spacing="12" align="flex-start">
        <NavSection title="Principal">
          <NavLink
            icon={RiDashboardLine}
            href="/"
            _activeLink={{
              textDecoration: "none",
              color: "green.400"
            }}
          >
            Dashboard
          </NavLink>
          <NavLink
            icon={TbUsers}
            href="/skatistas"
            _activeLink={{
              textDecoration: "none",
              color: "green.400"
            }}
          >
            Skatistas
          </NavLink>
          <NavLink
            icon={RiPinDistanceLine}
            href="/spots"
            _activeLink={{
              textDecoration: "none",
              color: "green.400"
            }}
          >
            Spots
          </NavLink>
          {/* <NavLink
            icon={RiEdit2Line}
            href="/users"
            _activeLink={{
              textDecoration: "none",
              color: "green.400"
            }}
          >
            Inscrições
          </NavLink>
          <NavLink
            icon={RiTrophyLine}
            href="/users"
            _activeLink={{
              textDecoration: "none",
              color: "green.400"
            }}
          >
            Campeonatos
          </NavLink> */}
          {/* <NavLink
            icon={RiDirectionLine}
            href="/users"
            _activeLink={{
              textDecoration: "none",
              color: "green.400"
            }}
          >
            Navigate
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
          </NavLink> */}
        </NavSection>

        {isAuthenticated && (
          <NavSection title="Usuário">
            <NavLink
              icon={RiPencilRulerFill}
              href="/dashboard"
              _activeLink={{
                textDecoration: "none",
                color: "green.400"
              }}
            >
              Painel do criador
            </NavLink>
            <NavLink
              icon={RiContactsLine}
              href="/general"
              _activeLink={{
                textDecoration: "none",
                color: "green.400"
              }}
            >
              Cadastro atleta
            </NavLink>
          </NavSection>
        )}

        {/* <NavSection title="Financeiro">
          <NavLink
            icon={RiCashLine}
            href="/path4"
            _activeLink={{
              textDecoration: "none",
              color: "green.400"
            }}
          >
            Histórico
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
        </NavSection> */}

        {/* <NavSection title="Calendário">
          <NavLink icon={RiInputMethodLine} href="/path6">
          Item 1
          </NavLink>
          <NavLink icon={RiGitMergeLine} href="/path7">
          Item 2
          </NavLink>
        </NavSection> */}
      </Stack>
    </Box>
  );
}
