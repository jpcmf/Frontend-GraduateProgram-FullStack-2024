"use client";

import { Text, TextProps } from "@chakra-ui/react";

export const SectionLabel = (props: TextProps) => (
  <Text
    as="h4"
    fontSize="xs"
    fontWeight="bold"
    letterSpacing="0.08em"
    textTransform="uppercase"
    color="content.secondary"
    {...props}
  />
);
