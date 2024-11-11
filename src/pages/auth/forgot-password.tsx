import Head from "next/head";
import Link from "next/link";
import { z } from "zod";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiAlertLine } from "react-icons/ri";
import { SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Divider, Flex, Stack, Text } from "@chakra-ui/react";

import { API } from "@/utils/constant";
import { Toast } from "@/components/Toast";
import { Input } from "@/components/Form/Input";
import { LogoSkateHub } from "@/components/LogoSkateHub";

const forgotPasswordFormSchema = z.object({
  email: z.string().email("E-mail inválido.").nonempty("Campo obrigatório.")
});

type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordFormSchema>;

export default function ForgotPassword() {
  const route = useRouter();
  const { addToast } = Toast();

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
      const response = await fetch(`${API}/api/auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      console.log("response...", response);

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
          route.push("/auth/signin");
        }, 5000);

        return data;
      } else {
        const text = await response.text();
        console.warn("Non-JSON response:", text);
        return { error: "Non-JSON response", details: text };
      }
    } catch (error) {
      console.error("error...", error);

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
      <Head>
        <title>Esqueci minha senha - SkateHub</title>
      </Head>
      <Flex
        w={["100dvw"]}
        h={["100dvh"]}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        bg="gray.900"
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundBlendMode="overlay"
        backgroundPosition="center bottom"
        backgroundImage="../alexander-londono-unsplash.jpeg"
        px={["4", "0"]}
      >
        <Flex
          as="form"
          w="100%"
          maxWidth={480}
          bg="gray.800"
          p="8"
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(handleForgotPassword)}
        >
          <Stack spacing={4}>
            <Flex justifyContent="space-between" alignItems="center">
              <Link href="/">
                <LogoSkateHub width={148} />
              </Link>
              <h1 style={{ fontSize: "18px", fontWeight: 600 }}>Recuperar senha</h1>
            </Flex>
            <Divider borderColor="gray.900" />

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
            <Flex flexDir="column">
              <Box border="1px solid" bg="blackAlpha.50" borderColor="gray.900" borderRadius="md" p="4">
                <Text fontSize="smaller" align="left" display="flex">
                  <RiAlertLine size={16} style={{ marginRight: "0.5rem", flexShrink: "0" }} />
                  Não se preocupe! Enviaremos um link para você criar uma nova senha.
                </Text>
              </Box>
            </Flex>
          </Stack>
          <Button type="submit" mt="6" colorScheme="green" size="lg" isLoading={isSubmitting} loadingText="Enviando...">
            Enviar link
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
