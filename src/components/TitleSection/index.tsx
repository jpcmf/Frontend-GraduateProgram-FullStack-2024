import { Box, Flex, Heading, useColorModeValue } from "@chakra-ui/react";

interface TitleSectionProps {
  title: string;
  size?: string;
  fontWeight?: string;
}

export function TitleSection({ title, size = "lg", fontWeight = "semibold" }: TitleSectionProps) {
  const titleBgColor = useColorModeValue("white", "gray.900");

  return (
    <Box mb={6}>
      <Flex direction="row" alignItems="center">
        <Heading size={size} fontWeight={fontWeight} bg={titleBgColor} py={0} pr={4}>
          {title}
        </Heading>
      </Flex>
    </Box>
  );
}
