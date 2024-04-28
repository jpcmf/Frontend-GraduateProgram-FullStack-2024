import Head from "next/head";
import { z } from "zod";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";

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
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: "" }
  });

  const handleForgotPassword: SubmitHandler<ForgotPasswordFormSchema> = async values => {
    try {
      await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      addToast({
        title: "E-mail enviado com sucesso.",
        message:
          "Verifique sua caixa de entrada para instruções sobre como recuperar sua senha. Ao clicar no link fornecido, você poderá definir uma nova senha.",
        type: "success"
      });

      route.push("/auth/signin");
    } catch (error) {
      addToast({
        title: "Erro ao processar solicitação.",
        message: "Houve um erro ao tentar criar sua conta. Por favor, verifique seus dados e tente novamente.",
        type: "error"
      });
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
          maxWidth={425}
          bg="gray.800"
          p="8"
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(handleForgotPassword)}
        >
          <Stack spacing={4}>
            <Flex justifyContent="center" mb="4">
              <LogoSkateHub />
            </Flex>
            <Flex flexDir="column">
              <Box border="1px solid" bg="gray.900" borderColor="gray.900" borderRadius="md" p="4">
                <Text fontSize="smaller" align="left">
                  Insira o e-mail cadastrado abaixo e enviaremos um link para você criar uma nova senha.
                </Text>
                <Text fontSize="smaller" mt="4" align="left">
                  Não se preocupe! Seu e-mail está seguro conosco.
                </Text>
              </Box>
            </Flex>
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

          <Button type="submit" mt="6" colorScheme="green" size="lg" isLoading={isSubmitting} loadingText="Enviando...">
            Enviar link
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
