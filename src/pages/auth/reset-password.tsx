import Head from "next/head";
import { z } from "zod";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Stack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";

import { API } from "@/utils/constant";
import { Toast } from "@/components/Toast";
import { Input } from "@/components/Form/Input";
import { LogoSkateHub } from "@/components/LogoSkateHub";

const resetPasswordFormSchema = z.object({
  password: z.string().nonempty("Campo obrigatório."),
  passwordConfirmation: z.string().nonempty("Campo obrigatório.")
});

type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPassword() {
  const route = useRouter();
  const { addToast } = Toast();

  const {
    handleSubmit,
    register,
    resetField,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { passwordConfirmation: "", password: "" },
    mode: "onChange"
  });

  const onSubmit: SubmitHandler<ResetPasswordFormSchema> = async values => {
    const response = await fetch(`${API}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...values, code: route.query.code })
    });

    const data = await response.json();

    if (data.error) {
      addToast({
        title: "Erro ao processar solicitação.",
        message:
          "Houve um erro ao tentar resetar sua senha. Por favor, verifique seus dados e tente novamente. " +
          data.error.message,
        type: "error"
      });
      resetField("password");
      resetField("passwordConfirmation");
      return;
    }

    addToast({
      title: "Senha alterada com sucesso.",
      message: "Sua senha foi alterada com sucesso. Faça login para acessar a plataforma.",
      type: "success"
    });

    resetField("password");
    resetField("passwordConfirmation");

    setTimeout(() => {
      route.push("/auth/signin");
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Resetar senha - SkateHub</title>
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
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={4}>
            <Flex justifyContent="center" mb="4">
              <LogoSkateHub />
            </Flex>
            <Flex flexDir="column">
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Digite sua nova senha"
                {...register("password")}
                error={errors.password}
              />
            </Flex>
            <Flex flexDir="column">
              <Input
                id="passwordConfirmation"
                type="password"
                label="passwordConfirmation"
                placeholder="Digite seu passwordConfirmation"
                {...register("passwordConfirmation")}
                error={errors.passwordConfirmation}
              />
            </Flex>
          </Stack>
          <Button type="submit" mt="6" colorScheme="green" size="lg" isLoading={isSubmitting} loadingText="Enviando...">
            Confirmar
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
