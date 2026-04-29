import { RiRobot2Line } from "react-icons/ri";
import { TbSkateboarding } from "react-icons/tb";
import ReactMarkdown from "react-markdown";

import { Avatar, Box, Code, HStack, Text, VStack } from "@chakra-ui/react";

import { useColors } from "@/hooks/useColors";
import type { Message } from "@/types/ai";

interface MessageProps {
  message: Message;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const { chatIAUserBg, chatIAAnswerBg, chatIATextUser, chatIATextAnswer } = useColors();
  const textColor = isUser ? chatIATextUser : chatIATextAnswer;

  return (
    <HStack align="flex-start" spacing={3} mb={4} justifyContent={isUser ? "flex-end" : "flex-start"} w="100%">
      {!isUser && <Avatar icon={<RiRobot2Line size="18" />} size="sm" bg="green.400" color="white" />}

      <VStack align={isUser ? "flex-end" : "flex-start"} spacing={1} maxW="70%">
        <Box bg={isUser ? chatIAUserBg : chatIAAnswerBg} px={4} py={3} borderRadius="md" wordBreak="break-word">
          {isUser ? (
            <Text fontSize="sm" color={textColor}>
              {message.content}
            </Text>
          ) : (
            <Box
              fontSize="sm"
              color={textColor}
              sx={{
                "& p": { mb: 2, lineHeight: "tall" },
                "& p:last-child": { mb: 0 },
                "& strong": { fontWeight: "bold" },
                "& em": { fontStyle: "italic" },
                "& ul": { pl: 4, mb: 2 },
                "& ol": { pl: 4, mb: 2 },
                "& li": { mb: 1 },
                "& h1, & h2, & h3": { fontWeight: "bold", mt: 3, mb: 1 },
                "& h1": { fontSize: "lg" },
                "& h2": { fontSize: "md" },
                "& h3": { fontSize: "sm" },
                "& code": { bg: "blackAlpha.200", px: 1, borderRadius: "sm", fontFamily: "mono", fontSize: "xs" },
                "& pre": { bg: "blackAlpha.200", p: 3, borderRadius: "md", overflowX: "auto", mb: 2 },
                "& pre code": { bg: "transparent", p: 0 },
                "& blockquote": { borderLeftWidth: 3, borderLeftColor: "green.400", pl: 3, opacity: 0.8, mb: 2 }
              }}
            >
              <ReactMarkdown
                components={{
                  code({ children, className, ...props }) {
                    const isBlock = className?.startsWith("language-");
                    return isBlock ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <Code fontSize="xs" {...props}>
                        {children}
                      </Code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </Box>
          )}
        </Box>
      </VStack>

      {isUser && <Avatar icon={<TbSkateboarding size="18" />} size="sm" bg="green.400" color="white" />}
    </HStack>
  );
}
