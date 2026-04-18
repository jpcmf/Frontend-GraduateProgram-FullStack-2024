"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Toast } from "@/components/Toast";
import { useColors } from "@/hooks/useColors";
import { Input } from "@/shared/components/Form/Input";
import { API } from "@/utils/constant";

const resetPasswordFormSchema = z
  .object({
    password: z.string().min(6, {
      message: "Senha obrigatória. Mínimo de 6 caracteres."
    }),
    passwordConfirmation: z.string().min(6, {
      message: "Senha de confirmação obrigatória."
    })
  })
  .refine(data => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "As senhas não coincidem."
  });

type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = Toast();
  const { bgColorNoOpacity, border } = useColors();

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
      body: JSON.stringify({ ...values, code: searchParams?.get("code") })
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
      router.push("/auth/signin");
    }, 3000);
  };

  return (
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
      position="absolute"
      top={0}
      left={0}
      zIndex={10}
    >
      <Flex
        as="form"
        w="100%"
        maxWidth={480}
        bg={bgColorNoOpacity}
        p={{ base: 4, md: 8 }}
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={4}>
          <Flex alignItems="center">
            <Link href="/">
              <Image src="/skatehub.png" alt="SkateHub" width={42} height={42} style={{ marginRight: "16px" }} />
            </Link>
            <Text as="h1" fontSize="2xl" fontWeight="semibold">
              Resetar senha
            </Text>
          </Flex>
          <Divider borderColor={border} />

          <Flex flexDir="column">
            <Input
              id="password"
              type="password"
              label="Senha"
              placeholder="Digite sua nova senha"
              {...register("password")}
              error={errors.password}
            />
          </Flex>
          <Flex flexDir="column">
            <Input
              id="passwordConfirmation"
              type="password"
              label="Confirmar senha"
              placeholder="Confirmar a nova senha"
              {...register("passwordConfirmation")}
              error={errors.passwordConfirmation}
            />
          </Flex>
        </Stack>
        <Button
          type="submit"
          mt="6"
          colorScheme="green"
          fontWeight="bold"
          size={["md", "lg"]}
          isLoading={isSubmitting}
          loadingText="Enviando..."
        >
          Confirmar
        </Button>
      </Flex>
    </Flex>
  );
}
