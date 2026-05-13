import React from "react";

import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" minH="50vh" p={8}>
          <VStack spacing={4} textAlign="center" maxW="md">
            <Heading size="md">Something went wrong</Heading>
            <Text color="gray.500" fontSize="sm">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </Text>
            <Button size="sm" onClick={this.handleReset}>
              Try again
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
