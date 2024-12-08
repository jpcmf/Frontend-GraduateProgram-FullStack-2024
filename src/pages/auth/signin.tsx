import Head from "next/head";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { z } from "zod";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Flex, Stack, Text, Link as ChakraLink } from "@chakra-ui/react";

import { Input } from "@/shared/components/Form/Input";
import { Toast } from "@/components/Toast";
import { AuthContext } from "@/contexts/AuthContext";
import { LogoSkateHub } from "@/components/LogoSkateHub";

const signInFormSchema = z.object({
  email: z.string().email({ message: "E-mail deve ser um e-mail válido." }).min(1, { message: "Campo obrigatório." }),
  password: z.string().min(1, { message: "Campo obrigatório." })
});

type SignInFormSchema = z.infer<typeof signInFormSchema>;

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useContext(AuthContext);
  const { addToast } = Toast();
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifiedError, setIsVerifiedError] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange"
  });

  const handleSignIn: SubmitHandler<SignInFormSchema> = async values => {
    if (isVerified) {
      const recaptchaValue = recaptchaRef.current?.getValue();
      const newValues = { ...values, recaptcha: recaptchaValue || undefined };

      await signIn(newValues)
        .then(_ => {})
        .catch(error => {
          recaptchaRef.current?.reset();
          setIsVerified(false);

          switch (error.response.data.error?.message) {
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
    } else {
      setIsVerifiedError(true);
      console.log("Please verify the reCAPTCHA.");
    }
  };

  const onVerify = (token: string | null) => {
    if (!token) return;

    if (token) {
      setIsVerified(true);
      setIsVerifiedError(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - SkateHub</title>
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
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Stack spacing={4}>
            <Flex justifyContent="center" mb="4">
              <Link href="/">
                <LogoSkateHub />
              </Link>
            </Flex>
            <Flex flexDir="column">
              <Input id="email" type="email" label="E-mail" {...register("email")} error={errors.email} />
            </Flex>
            <Flex flexDir="column">
              <Input id="password" type="password" label="Senha" {...register("password")} error={errors.password} />
            </Flex>
            <Flex flexDir="column">
              <Box border="1px solid" bg="blackAlpha.50" borderColor="gray.900" borderRadius="md" p="4">
                <Text fontSize="smaller" align="left">
                  Se precisar de ajuda, entre em{" "}
                  <Text as="a" href="#" textDecoration="underline" fontWeight="medium" color="gray.600">
                    contato conosco
                  </Text>
                  .
                </Text>
              </Box>
            </Flex>

            <Flex flexDir="column" alignItems="center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={onVerify}
                size="normal"
                hl="pt-BR"
                badge="inline"
                id="recaptcha"
              />
              {isVerifiedError && (
                <Text fontSize={"13.3px"} fontWeight="semibold" color="red.500" mt="1.5">
                  Please verify that you are not a robot.
                </Text>
              )}
            </Flex>
          </Stack>
          <Button
            type="submit"
            mt="6"
            colorScheme="green"
            fontWeight="bold"
            size={["md", "lg"]}
            isLoading={isSubmitting}
          >
            Entrar
          </Button>
          <ChakraLink
            onClick={() => router.push("/auth/forgot-password")}
            color="gray.600"
            mt="4"
            textAlign="center"
            textDecoration="underline"
            fontWeight="medium"
          >
            Esqueci minha senha
          </ChakraLink>
        </Flex>
      </Flex>
    </>
  );
}
