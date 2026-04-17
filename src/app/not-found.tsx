import Link from "next/link";

import { Button, Flex, Heading, VStack } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" px={4}>
      <VStack spacing={6} textAlign="center">
        <Heading as="h1" size="2xl">
          404 - Page Not Found
        </Heading>
        <p>The page you're looking for doesn't exist.</p>
        <Link href="/">
          <Button colorScheme="blue" size="lg">
            Go back home
          </Button>
        </Link>
      </VStack>
    </Flex>
  );
}
