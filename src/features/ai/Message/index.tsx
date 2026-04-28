import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";

import type { Message } from "@/types/ai";

interface MessageProps {
  message: Message;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <HStack align="flex-start" spacing={3} mb={4} justifyContent={isUser ? "flex-end" : "flex-start"} w="100%">
      {!isUser && <Avatar size="sm" name="AI Assistant" bg="green.400" color="white" />}

      <VStack align={isUser ? "flex-end" : "flex-start"} spacing={1} maxW="70%">
        <Box bg={isUser ? "blue.100" : "gray.100"} px={4} py={3} borderRadius="md" wordBreak="break-word">
          <Text fontSize="sm" color={isUser ? "blue.900" : "gray.900"}>
            {message.content}
          </Text>
        </Box>
      </VStack>

      {isUser && <Avatar size="sm" name="You" bg="blue.400" color="white" />}
    </HStack>
  );
}
