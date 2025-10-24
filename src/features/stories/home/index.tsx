
import { Box, Divider, Flex, Heading } from "@chakra-ui/react";

import { StoriesSwiper } from '@/components/StoriesSwiper';

export function StoriesHome() {
  return (
    <>
      <Box mb={6}>
        <Flex direction="row" alignItems="center" position="relative">
          <Heading size="md" fontWeight="semibold" bg="gray.900" py={0} pr={4}>
            Online agora
          </Heading>
          <Divider my="0" borderColor="gray.700" position="absolute" left={0} right={0} zIndex={-1} />
        </Flex>
      </Box>
      <StoriesSwiper />
    </>
  );
}
