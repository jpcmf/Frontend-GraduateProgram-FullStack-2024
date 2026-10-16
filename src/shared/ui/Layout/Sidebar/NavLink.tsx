"use client";

import { ElementType } from "react";
import Link, { LinkProps as NextLinkProps } from "next/link";
import { usePathname } from "next/navigation";

import { Icon, Link as ChakraLink, LinkProps as ChakraLinkProps, Text } from "@chakra-ui/react";

interface NavLinkProps extends ChakraLinkProps {
  icon: ElementType;
  children: string;
  href: string;
}

export function NavLink({ icon, children, href, ...rest }: NavLinkProps & NextLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <ChakraLink
      as={Link}
      href={href}
      passHref
      display="flex"
      align="center"
      className={isActive ? "active-class" : ""}
      aria-current={isActive ? "page" : undefined}
      {...rest}
    >
      <Icon as={icon} fontSize="20" color="green.400" />
      <Text ml="4" fontWeight="medium">
        {children}
      </Text>
    </ChakraLink>
  );
}
