"use client";

import { useEffect, useRef, useState } from "react";
import { RiRobot2Line } from "react-icons/ri";
import { TbSkateboard } from "react-icons/tb";
import NextLink from "next/link";

import { Box, Button, Center, HStack, Spinner, Text, VStack } from "@chakra-ui/react";

import { useAIChat } from "@/hooks/useAIChat";
import { useColors } from "@/hooks/useColors";
import { Input } from "@/shared/ui/form/Input";

import { Message } from "../Message";

const INITIAL_SUGGESTIONS = [
  "Como mandar aquele ollie cabuloso?",
  "Qual shape devo usar para a modalidade street do skate?",
  "Como evitar lesões enquanto dou um rolê pesado de skate?"
];

export function Chat() {
  const { messages, isPending, isAuthenticated, submitMessage } = useAIChat();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isConversationStarted = messages.length > 0;
  const { bgColor, cardBg, border, textPrimary, textMuted, chatIASuggestionBg } = useColors();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input after sending
  useEffect(() => {
    if (!isPending) {
      inputRef.current?.focus();
    }
  }, [isPending]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isPending) return;
    const message = inputValue;
    setInputValue("");
    await submitMessage(message);
  };

  const handleSuggestionClick = (suggestion: string) => {
    submitMessage(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <VStack h={isConversationStarted ? "100%" : "100%"} w="100%" spacing={0} justify="space-between">
      {/* Hero Section - always visible */}
      <VStack spacing={4} textAlign="center" py={4}>
        <Box w={16} h={16} borderRadius="full" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
          <RiRobot2Line size={32} color="#48D597" />
        </Box>
        <VStack spacing={2}>
          <Text fontSize="3xl" fontWeight="bold" color={textPrimary}>
            Truta IA
          </Text>
          <Text fontSize="md" color={textMuted}>
            E aí truta! Sou o assistente do SkateHub. Pronto para dropar no conhecimento? Como posso te ajudar hoje?
          </Text>
        </VStack>
      </VStack>

      {/* Main content area */}
      <Box flex={1} w="100%" overflowY="auto" borderRadius="md" mb={4} maxW="800px" mx="auto">
        {!isConversationStarted ? (
          /* Suggestions (before conversation) */
          <Center h="100%" flexDirection="column">
            <VStack spacing={3} align="stretch" w="100%" maxW="500px">
              {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  onClick={() => handleSuggestionClick(suggestion)}
                  textAlign="left"
                  justifyContent="flex-start"
                  h="auto"
                  py={3}
                  px={4}
                  whiteSpace="normal"
                  bg={chatIASuggestionBg}
                  isDisabled={!isAuthenticated}
                  _hover={isAuthenticated ? { borderColor: "green.400", bg: cardBg } : {}}
                  gap={4}
                >
                  <TbSkateboard size={18} />
                  {suggestion}
                </Button>
              ))}
            </VStack>
          </Center>
        ) : (
          /* Chat area (after first message) */
          <VStack align="stretch" spacing={4} mt={5}>
            {messages
              .filter(msg => msg.role === "user" || msg.content !== "")
              .map(msg => (
                <Message key={msg.id} message={msg} />
              ))}
            {isPending && messages[messages.length - 1]?.content === "" && (
              <HStack justify="flex-start">
                <Spinner size="sm" color="green.400" />
                <Text fontSize="sm" color="gray.500">
                  Truta IA está pensando...
                </Text>
              </HStack>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>

      {/* Input area — auth gate */}
      {isAuthenticated ? (
        <HStack w="100%" maxW="800px" mx="auto" spacing={2}>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Manda as ideias sobre o skate..."
            isDisabled={isPending}
            borderColor={border}
            _focus={{
              borderColor: "green.400"
            }}
          />
          <Button
            onClick={handleSubmit}
            isLoading={isPending}
            loadingText="Enviando"
            disabled={!inputValue.trim() || isPending}
            bg="green.400"
            color="white"
            _hover={{ bg: "green.500" }}
            _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
          >
            Enviar
          </Button>
        </HStack>
      ) : (
        <VStack
          w="100%"
          maxW="800px"
          mx="auto"
          spacing={3}
          py={4}
          px={4}
          borderRadius="md"
          borderWidth={1}
          borderColor={border}
        >
          <Text fontSize="sm" color={textMuted} textAlign="center">
            Para conversar com a Truta IA, faça seu login ou crie uma conta gratuitamente.
          </Text>
          <HStack spacing={3}>
            <Button
              as={NextLink}
              href="/auth/signin?modal=login"
              bg="green.400"
              color="white"
              _hover={{ bg: "green.500" }}
              size="sm"
            >
              Login
            </Button>
            <Button
              as={NextLink}
              href="/auth/signup"
              variant="outline"
              borderColor="green.400"
              color="green.400"
              _hover={{ bg: cardBg }}
              size="sm"
            >
              Criar conta
            </Button>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
}
