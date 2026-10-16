"use client";

import { RiPinDistanceLine } from "react-icons/ri";
import NextLink from "next/link";

import { Button } from "@chakra-ui/react";

import { useAuth } from "@/shared/hooks/useAuth";

export function SpotsCreateButton() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Button leftIcon={<RiPinDistanceLine />} as={NextLink} href="/spots/new" colorScheme="green" size="sm">
      Criar Spot
    </Button>
  );
}
