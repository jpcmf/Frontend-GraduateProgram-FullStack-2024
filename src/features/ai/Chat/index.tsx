"use client";

import { useEffect, useRef, useState } from "react";
import { RiRobot2Line } from "react-icons/ri";

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
  const isConversationStarted = messages.length > 0;

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
    setTimeout(() => {
      submitMessage(suggestion);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <VStack h="100vh" w="100%" bg="white" spacing={0} justify="space-between" p={4}>
      {/* Main content area */}
      <Box flex={1} w="100%" overflowY="auto" borderRadius="md" mb={4} maxW="800px" mx="auto">
        {!isConversationStarted ? (
          /* Hero + Suggestions (before conversation) */
          <Center h="100%" flexDirection="column" gap={8}>
            {/* Hero Section */}
            <VStack spacing={4} textAlign="center">
              <Box
                w={16}
                h={16}
                borderRadius="full"
                bg="gray.800"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <RiRobot2Line size={32} color="#48D597" />
              </Box>
              <VStack spacing={2}>
                <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                  AI Assistant
                </Text>
                <Text fontSize="md" color="gray.600">
                  Ask anything about the skateboarding world
                </Text>
              </VStack>
            </VStack>

            {/* Suggestions */}
            <VStack spacing={3} align="stretch" w="100%" maxW="500px">
              {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  onClick={() => handleSuggestionClick(suggestion)}
                  textAlign="left"
                  h="auto"
                  py={3}
                  px={4}
                  whiteSpace="normal"
                  borderColor="gray.300"
                  _hover={{ borderColor: "green.400", bg: "green.50" }}
                >
                  {suggestion}
                </Button>
              ))}
            </VStack>
          </Center>
        ) : (
          /* Chat area (after first message) */
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

      {/* Input area (always at bottom) */}
      <HStack w="100%" maxW="800px" mx="auto" spacing={2}>
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about skateboarding..."
          disabled={isPending}
          borderColor="gray.300"
          _focus={{
            borderColor: "green.400",
            boxShadow: "0 0 0 1px rgb(72, 213, 151)"
          }}
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
