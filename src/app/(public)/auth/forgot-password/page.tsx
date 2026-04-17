"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { RiAlertLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

import { Box, Button, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { TitleSection } from "@/components/TitleSection";
import { Toast } from "@/components/Toast";
import { VALIDATION_MESSAGES } from "@/lib/const/validation";
import { Input } from "@/shared/components/Form/Input";
import { API } from "@/utils/constant";

const forgotPasswordFormSchema = z.object({
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL)
});

type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordFormSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const { addToast } = Toast();

  const bgColor = useColorModeValue("blackAlpha.100", "gray.800");

  const {
    handleSubmit,
    register,
    resetField,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: "" }
  });

  const handleForgotPassword: SubmitHandler<ForgotPasswordFormSchema> = async values => {
    try {
      const response = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        resetField("email");

        addToast({
          title: "E-mail enviado com sucesso.",
          message:
            "Verifique sua caixa de entrada para instruções sobre como recuperar sua senha. Ao clicar no link fornecido, você poderá definir uma nova senha.",
          type: "success"
        });

        setTimeout(() => {
          router.push("/auth/signin");
        }, 5000);

        return data;
      } else {
        const text = await response.text();
        return { error: "Non-JSON response", details: text };
      }
    } catch (error) {
      addToast({
        title: "Erro ao processar solicitação.",
        message: "Houve um erro ao tentar recuperar a senha. Por favor, verifique seus dados e tente novamente.",
        type: "error"
      });
      return { error: "Fetch error", details: error };
    }
  };

  return (
    <>
      <TitleSection title="Recuperar senha" />
      <Flex alignItems="center" flexDirection="column" height="100%" justifyContent="start" width="100%">
        <Flex
          as="form"
          w="100%"
          bg={bgColor}
          p={{ base: 4, md: 8 }}
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(handleForgotPassword)}
        >
          <Stack spacing={4}>
            <Flex flexDir="column">
              <Input
                id="email"
                type="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
                {...register("email")}
                error={errors.email}
              />
            </Flex>
          </Stack>
          <Flex flexDir={["column", null, "row"]} alignItems="end">
            <Button
              type="submit"
              mt="6"
              color="white"
              bg="green.400"
              _hover={{ bg: "green.600" }}
              size={["sm", "md"]}
              isLoading={isSubmitting}
              loadingText="Enviando..."
              w={["100%", null, "3xs"]}
              mr="auto"
            >
              Enviar link
            </Button>
            <Box mt={[4, null, 0]} textAlign="center">
              <Text fontSize="smaller" display="flex" justifyContent="center" color="gray.600">
                <RiAlertLine size={16} style={{ marginRight: "0.5rem", flexShrink: "0" }} />
                Enviaremos um link para você criar uma nova senha.
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
