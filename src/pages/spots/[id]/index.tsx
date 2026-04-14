import { useRouter } from "next/router";

import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

import { SpotDetail } from "@/features/spots/SpotDetail";
import { useSpot } from "@/hooks/useSpot";

export default function SpotDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, isError } = useSpot(id as string);

  if (isLoading || !id) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  if (isError || !data?.data) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Text color="red.400">Spot não encontrado.</Text>
      </Flex>
    );
  }

  return (
    <Box width={"100%"}>
      <SpotDetail spot={data.data} />
    </Box>
  );
}
