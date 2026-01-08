import { Box, Divider, Flex, Heading, useColorModeValue } from "@chakra-ui/react";

export function TitleSection({ title, size = "lg" }: { title: string; size?: string }) {
  const titleBgColor = useColorModeValue("white", "gray.900");

  return (
    <Box mb={6}>
      <Flex direction="row" alignItems="center" position="relative">
        <Heading size={size} bg={titleBgColor} py={0} pr={4}>
          {title}
        </Heading>
        <Divider my="0" borderColor="gray.700" position="absolute" left={0} right={0} zIndex={-1} />
      </Flex>
    </Box>
  );
}
