import { Box, Flex, Spinner } from "@chakra-ui/react";

import { TitleSection } from "@/components/TitleSection";
import { Dashboard } from "@/features/dashboard";
import { useAuth } from "@/hooks/useAuth";

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
    <>
      <TitleSection title="Painel do criador" />
      <Box flex="1" borderRadius={8} mb={8}>
        <Dashboard user={user} />
      </Box>
    </>
  );
}
