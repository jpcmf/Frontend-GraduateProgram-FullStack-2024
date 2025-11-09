import { Box, Divider, Flex, Grid, Heading, useColorModeValue } from "@chakra-ui/react";

export default function SpotsPage() {
  const bgColor = useColorModeValue("blackAlpha.100", "gray.800");
  const titleBgColor = useColorModeValue("white", "gray.900");
  return (
    <>
      <Box mb={6}>
        <Flex direction="row" alignItems="center" position="relative">
          <Heading size="lg" bg={titleBgColor} py={0} pr={4}>
            Spots
          </Heading>
          <Divider my="0" borderColor="gray.700" position="absolute" left={0} right={0} zIndex={-1} />
        </Flex>
      </Box>
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
