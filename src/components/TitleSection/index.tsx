import { Box, Flex, Heading } from "@chakra-ui/react";

interface TitleSectionProps {
  title: string;
  size?: string;
  fontWeight?: string;
}

export function TitleSection({ title, size = "lg", fontWeight = "semibold" }: TitleSectionProps) {
  return (
    <Box mb={6}>
      <Flex direction="row" alignItems="center">
        <Heading size={size} fontWeight={fontWeight} py={0} pr={4}>
          {title}
        </Heading>
      </Flex>
    </Box>
  );
}
