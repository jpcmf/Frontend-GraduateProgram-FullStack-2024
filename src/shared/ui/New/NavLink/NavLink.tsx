"use client";

import { ElementType, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Box, Icon, Link as ChakraLink, LinkProps as ChakraLinkProps, Text } from "@chakra-ui/react";

interface NavLinkProps extends Omit<ChakraLinkProps, "children"> {
  icon: ElementType;
  label: string;
  href: string;
  badge?: ReactNode;
}

export function NavLink({ icon, label, href, badge, ...rest }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <ChakraLink
      as={Link}
      href={href}
      display="flex"
      alignItems="center"
      gap={3}
      px={3}
      py={2}
      borderRadius="lg"
      fontSize="sm"
      fontWeight={isActive ? 600 : 400}
      color={isActive ? "accent.base" : "content.secondary"}
      bg={isActive ? "accent.subtle" : "transparent"}
      border="1px solid"
      borderColor={isActive ? "accent.line" : "transparent"}
      transition="all 0.2s"
      _hover={isActive ? {} : { bg: "surface.raised", color: "white" }}
      aria-current={isActive ? "page" : undefined}
      {...rest}
    >
      <Icon as={icon} boxSize={4} color={isActive ? "accent.base" : "content.muted"} />
      <Text>{label}</Text>
      {badge && <Box ml="auto">{badge}</Box>}
    </ChakraLink>
  );
}
