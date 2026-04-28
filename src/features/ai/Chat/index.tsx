"use client";

import { useEffect, useRef, useState } from "react";

import { Box, Button, Center, HStack, Input, Spinner, Text, VStack } from "@chakra-ui/react";

import { useAIChat } from "@/hooks/useAIChat";

import { Message } from "../Message";

const INITIAL_SUGGESTIONS = [
  "How to do an ollie?",
  "What board should I use for street skating?",
  "How to avoid injuries while skating?"
];

export function Chat() {
  const { messages, isPending, submitMessage } = useAIChat();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isPending) return;

    const message = inputValue;
    setInputValue("");
    await submitMessage(message);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <VStack h="100vh" w="100%" bg="white" spacing={0} justify="space-between" p={4}>
      {/* Messages area */}
      <Box flex={1} w="100%" overflowY="auto" borderRadius="md" mb={4} maxW="800px" mx="auto">
        {messages.length === 0 ? (
          <Center h="100%" flexDirection="column" gap={6}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.700">
              Ask anything about skateboarding
            </Text>
            <VStack spacing={3} align="stretch">
              {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  onClick={() => handleSuggestionClick(suggestion)}
                  textAlign="left"
                  h="auto"
                  py={3}
                  whiteSpace="normal"
                >
                  {suggestion}
                </Button>
              ))}
            </VStack>
          </Center>
        ) : (
          <VStack align="stretch" spacing={4}>
            {messages.map(msg => (
              <Message key={msg.id} message={msg} />
            ))}
            {isPending && (
              <HStack justify="flex-start">
                <Spinner size="sm" color="green.400" />
                <Text fontSize="sm" color="gray.500">
                  AI Assistant is thinking...
                </Text>
              </HStack>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>

      {/* Input area */}
      <HStack w="100%" maxW="800px" mx="auto" spacing={2}>
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about skateboarding..."
          disabled={isPending}
          borderColor="gray.300"
          _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px rgb(48, 140, 122)" }}
        />
        <Button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isPending}
          bg="green.400"
          color="white"
          _hover={{ bg: "green.500" }}
          _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
        >
          Send
        </Button>
      </HStack>
    </VStack>
  );
}
