import { Box, Divider, Flex, Heading } from '@chakra-ui/react';

export default function SpotsPage() {
  return (
    <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
      <Flex mb="8" direction="column">
        <Heading size="lg" fontWeight="normal">
          Spots
        </Heading>
        <Divider my="6" borderColor="gray.700" />
      </Flex>
    </Box>
  )
}