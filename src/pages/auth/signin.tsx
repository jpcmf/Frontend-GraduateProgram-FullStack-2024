import Head from "next/head";
import * as yup from "yup";
import { useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";

import { Input } from "@/components/Form/Input";
import { Toast } from "@/components/Toast";
import { AuthContext } from "@/contexts/AuthContext";
import { LogoSkateHub } from "@/components/LogoSkateHub";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório.").email("E-mail inválido."),
  password: yup.string().required("Password obrigatório.")
});

export default function SignIn() {
  const { signIn } = useContext(AuthContext);
  const { addToast } = Toast();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  });

  const { errors } = formState;

  const handleSignIn: SubmitHandler<SignInFormData> = async values => {
    await signIn(values)
      .then(_ => {})
      .catch(error => {
        switch (error.response?.data.error.message) {
          case "Your account email is not confirmed":
            addToast({
              title: "Erro de autenticação.",
              message: "Confirme seu e-mail para acessar a plataforma.",
              type: "warning"
            });
            break;
          case "Your account has been blocked by an administrator":
            addToast({
              title: "Erro de autenticação.",
              message:
                "Sua conta está temporariamente bloqueada. Se você acabou de se cadastrar, por favor, aguarde enquanto suas informações estão sendo revisadas por nossa equipe.",
              type: "error"
            });
            break;
          default:
            addToast({
              title: "Erro de autenticação.",
              message: "Verifique seus dados de login e tente novamente.",
              type: "error"
            });
            break;
        }
      });
  };

  return (
    <>
      <Head>
        <title>Entrar - SkateHub</title>
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
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Stack spacing={4}>
            <Flex justifyContent="center" mb="4">
              <LogoSkateHub />
            </Flex>
            <Flex flexDir="column">
              <Box border="1px solid" bg="gray.900" borderColor="gray.900" borderRadius="md" p="4">
                <Text fontSize="smaller" align="left">
                  Por favor, insira seu e-mail e senha cadastrado abaixo. Se precisar de ajuda, entre em{" "}
                  <Text as="a" href="#" textDecoration="underline" color="gray.600">
                    contato conosco
                  </Text>
                  .
                </Text>
              </Box>
            </Flex>
            <Flex flexDir="column">
              <Input id="email" type="email" label="E-mail" {...register("email")} error={errors.email} />
            </Flex>
            <Flex flexDir="column">
              <Input id="password" type="password" label="Senha" {...register("password")} error={errors.password} />
            </Flex>
          </Stack>
          <Button type="submit" mt="6" colorScheme="green" size="lg" isLoading={formState.isSubmitting}>
            Entrar
          </Button>
          <Text as="a" href="#" color="gray.600" mt="4" align="center" textDecoration="underline">
            Esqueci minha senha
          </Text>
        </Flex>
      </Flex>
    </>
  );
}
