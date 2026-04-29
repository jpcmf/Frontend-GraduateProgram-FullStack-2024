import { RiRobot2Line } from "react-icons/ri";
import { TbSkateboarding } from "react-icons/tb";

import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";

import { useColors } from "@/hooks/useColors";
import type { Message } from "@/types/ai";

interface MessageProps {
  message: Message;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const { chatIAUserBg, chatIAAnswerBg, chatIATextUser, chatIATextAnswer } = useColors();

  return (
    <HStack align="flex-start" spacing={3} mb={4} justifyContent={isUser ? "flex-end" : "flex-start"} w="100%">
      {!isUser && <Avatar icon={<RiRobot2Line size="18" />} size="sm" bg="green.400" color="white" />}

      <VStack align={isUser ? "flex-end" : "flex-start"} spacing={1} maxW="70%">
        <Box bg={isUser ? chatIAUserBg : chatIAAnswerBg} px={4} py={3} borderRadius="md" wordBreak="break-word">
          <Text fontSize="sm" color={isUser ? chatIATextUser : chatIATextAnswer}>
            {message.content}
          </Text>
        </Box>
      </VStack>

      {isUser && <Avatar icon={<TbSkateboarding size="18" />} size="sm" bg="green.400" color="white" />}
    </HStack>
  );
}
