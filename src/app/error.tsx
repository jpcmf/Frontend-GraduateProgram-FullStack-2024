"use client";

import { Button, Flex, Heading, VStack } from "@chakra-ui/react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" px={4}>
      <VStack spacing={6} textAlign="center">
        <Heading as="h1" size="2xl">
          Oops! Something went wrong
        </Heading>
        <p>{error.message || "An unexpected error occurred"}</p>
        {error.digest && <p style={{ fontSize: "0.875rem", color: "gray" }}>Error ID: {error.digest}</p>}
        <Button onClick={reset} colorScheme="blue" size="lg">
          Try again
        </Button>
      </VStack>
    </Flex>
  );
}
