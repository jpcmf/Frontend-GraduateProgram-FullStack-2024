import Head from "next/head";
import Link from "next/link";
import { z } from "zod";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiAlertLine } from "react-icons/ri";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Flex, Text, Stack, Box, Divider } from "@chakra-ui/react";

import { API } from "@/utils/constant";
import { Input } from "@/components/Form/Input";
import { Toast } from "@/components/Toast";
import { LogoSkateHub } from "@/components/LogoSkateHub";

export default function SignUp() {
  const route = useRouter();
  const { addToast } = Toast();

  const signUpSchema = z
    .object({
      name: z.string().nonempty("Campo obrigatório.").min(8, { message: "Nome deve ter no mínimo 8 caracteres." }),
      username: z
        .string()
        .nonempty("Campo obrigatório.")
        .min(3, { message: "Usuário deve ter no mínimo 3 caracteres." }),
      email: z.string().nonempty("Campo obrigatório.").email({ message: "E-mail deve ser um e-mail válido." }),
      password: z.string().nonempty("Campo obrigatório.").min(6, { message: "Senha deve ter no mínimo 6 caracteres." }),
      confirmPassword: z.string().nonempty("Campo obrigatório.")
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "Senhas não conferem.",
          path: ["confirmPassword"]
        });
      }
    });

  type SignUpSchema = z.infer<typeof signUpSchema>;

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" }
  });

  const onFinish: SubmitHandler<SignUpSchema> = async values => {
    try {
      const response = await fetch(`${API}/api/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (data.error) {
        throw data.error;
      } else {
        addToast({
          title: "Cadastro efetuado com sucesso.",
          message:
            "Você receberá um e-mail para confirmar o seu endereço de e-mail. Por favor, verifique sua caixa de entrada.",
          type: "success"
        });

        route.push("/");
      }
    } catch (error: any) {
      if (error.status === 400) {
        addToast({
          title: "Usuário já cadastrado.",
          message:
            "Este usuário já está registrado em nosso sistema. Por favor, faça login ou recupere sua senha, se necessário.",
          type: "error"
        });
      } else {
        addToast({
          title: "Erro ao processar solicitação.",
          message: "Houve um erro ao tentar criar sua conta. Por favor, verifique seus dados e tente novamente.",
          type: "error"
        });
      }
    }
  };

  return (
    <>
      <Head>
        <title>Cadastrar - SkateHub</title>
      </Head>
      <Flex
        w={[null, "100dvw"]}
        h={[null, "100dvh"]}
        bg="gray.900"
        alignItems="center"
        justifyContent="center"
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundBlendMode="overlay"
        backgroundPosition="center bottom"
        backgroundImage="../alexander-londono-unsplash.jpeg"
        px={["4", "0"]}
        py={["4", "0"]}
      >
        <Flex
          as="form"
          w="100%"
          maxWidth={720}
          bg="gray.800"
          p="8"
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(onFinish)}
        >
          <Stack spacing={4}>
            <Flex justifyContent="space-between" mb="4">
              <h1 style={{ fontSize: "32px", fontWeight: 600 }}>Cadastro</h1>
              <Link href="/">
                <LogoSkateHub width={148} />
              </Link>
            </Flex>
            <Divider borderColor="gray.900" />

            <Flex flexDir="column">
              <Input
                id="name"
                type="text"
                label="Nome completo"
                placeholder="Digite seu nome completo"
                {...register("name")}
                error={errors.name}
              />
            </Flex>
            <Flex flexDir={["column", null, "row"]} gap="4">
              <Input
                id="username"
                type="text"
                label="Usuário"
                placeholder="Digite seu nome de usuário"
                {...register("username")}
                error={errors.username}
              />
              <Input
                id="email"
                type="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
                {...register("email")}
                error={errors.email}
              />
            </Flex>
            <Flex flexDir={["column", null, "row"]} gap="4">
              <Input
                id="password"
                type="password"
                label="Senha"
                placeholder="Digite uma senha"
                {...register("password")}
                error={errors.password}
              />
              <Input
                id="confirmPassword"
                type="password"
                label="Confirmar senha"
                placeholder="Confirme a senha"
                {...register("confirmPassword")}
                error={errors.confirmPassword}
              />
            </Flex>
          </Stack>

          <Flex flexDir="column" mt="6">
            <Box border="1px solid" bg="blackAlpha.50" borderColor="gray.900" borderRadius="md" p="4">
              <Text fontSize="smaller" mt="4" align="left" display="flex">
                <RiAlertLine size={16} style={{ marginRight: "0.5rem", flexShrink: "0" }} />
                Verifique sua caixa de entrada para o e-mail de confirmação. Assim que seu cadastro for aprovado, você
                receberá um e-mail de confirmação para realizar o login na plataforma e preencher seu cadastro completo.
              </Text>
            </Box>
          </Flex>

          <Button
            type="submit"
            mt="6"
            colorScheme="green"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Cadastrando..."
          >
            Cadastrar
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
