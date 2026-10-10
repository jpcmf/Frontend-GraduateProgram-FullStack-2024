"use client";

import { BoxProps, Flex } from "@chakra-ui/react";

export const IconLabel = ({ icon, children, ...rest }: { icon: React.ReactNode } & BoxProps) => (
  <Flex align="center" gap={1.5} {...rest}>
    {icon}
    {children}
  </Flex>
);
