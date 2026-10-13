"use client";

import { Box, Flex, Spinner } from "@chakra-ui/react";

import { Dashboard } from "@/features/dashboard";
import { useAuth } from "@/shared/hooks/useAuth";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  if (!user) return null;

  return (
    <Box flex="1" mb={8}>
      <Dashboard user={user} />
    </Box>
  );
}
