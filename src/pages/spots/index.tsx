import { Box, Flex, Grid, useColorModeValue } from "@chakra-ui/react";

import { TitleSection } from "@/components/TitleSection";

export default function SpotsPage() {
  const bgColor = useColorModeValue("blackAlpha.100", "gray.800");
  return (
    <>
      <TitleSection title="Spots" />
      <Box flex="1" borderRadius={8} bg={bgColor} p={["6", "8"]} mb={8}>
        <Flex mb="8" direction="column">
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
            <Box>Image 1</Box>
            <Box>Image 2</Box>
            <Box>Image 3</Box>
          </Grid>
        </Flex>
      </Box>
    </>
  );
}
