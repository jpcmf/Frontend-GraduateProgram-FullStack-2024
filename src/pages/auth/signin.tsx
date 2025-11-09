import { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { RiAlertLine } from "react-icons/ri";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Toast } from "@/components/Toast";
import { AuthContext } from "@/contexts/AuthContext";
import { SignInFormSchema, signInFormSchema } from "@/features/user/signInFormSchema";
import { Input } from "@/shared/components/Form/Input";
import { redirectIfAuthenticated } from "@/utils/auth";

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useContext(AuthContext);
  const { addToast } = Toast();
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isExecutingRecaptcha, setIsExecutingRecaptcha] = useState(false);

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
    if (recaptchaRef.current) {
      try {
        setIsExecutingRecaptcha(true);
        // for v2 invisible, use executeAsync(). For v3, use execute()
        const recaptchaValue =
          (await recaptchaRef.current.executeAsync?.()) || (await recaptchaRef.current.execute?.());
        const newValues = { ...values, recaptcha: recaptchaValue || undefined };

        await signIn(newValues)
          .then(_ => {
            recaptchaRef.current?.reset();
          })
          .catch(error => {
            recaptchaRef.current?.reset();

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
      } catch (error) {
        console.error("reCAPTCHA execution failed:", error);
        addToast({
          title: "Erro de verificação.",
          message: "Falha na verificação de segurança. Tente novamente.",
          type: "error"
        });
      } finally {
        setIsExecutingRecaptcha(false);
      }
    } else {
      addToast({
        title: "Erro de verificação.",
        message: "Sistema de verificação não está disponível.",
        type: "error"
      });
    }
  };
  //   if (isVerified) {
  //     const recaptchaValue = recaptchaRef.current?.getValue();
  //     const newValues = { ...values, recaptcha: recaptchaValue || undefined };

  //     await signIn(newValues)
  //       .then(_ => { })
  //       .catch(error => {
  //         recaptchaRef.current?.reset();
  //         setIsVerified(false);

  //         switch (error.response.data.error?.message) {
  //           case "Your account email is not confirmed":
  //             addToast({
  //               title: "Erro de autenticação.",
  //               message: "Confirme seu e-mail para acessar a plataforma.",
  //               type: "warning"
  //             });
  //             break;
  //           case "Your account has been blocked by an administrator":
  //             addToast({
  //               title: "Erro de autenticação.",
  //               message:
  //                 "Sua conta está temporariamente bloqueada. Se você acabou de se cadastrar, por favor, aguarde enquanto suas informações estão sendo revisadas por nossa equipe.",
  //               type: "error"
  //             });
  //             break;
  //           default:
  //             addToast({
  //               title: "Erro de autenticação.",
  //               message: "Verifique seus dados de login e tente novamente.",
  //               type: "error"
  //             });
  //             break;
  //         }
  //       });
  //   } else {
  //     setIsVerifiedError(true);
  //     console.log("Please verify the reCAPTCHA.");
  //   }
  // };

  // const onVerify = (token: string | null) => {
  //   if (!token) return;

  //   if (token) {
  //     setIsVerified(true);
  //     setIsVerifiedError(false);
  //   }
  // };

  return (
    <>
      <Head>
        <title>Login - SkateHub</title>
      </Head>
      <Flex
        alignItems="center"
        bg="gray.900"
        flexDirection="column"
        height="100%"
        justifyContent="start"
        mb={8}
        width="100%"
      >
        <Flex
          as="form"
          w="100%"
          bg="gray.800"
          p="8"
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Stack spacing={4}>
            <Flex alignItems="center">
              <Link href="/">
                <Image src="/skatehub.png" alt="SkateHub" width={42} height={42} style={{ marginRight: "16px" }} />
              </Link>
              <Text as="h1" fontSize="2xl" fontWeight="semibold">
                Faça seu login
              </Text>
            </Flex>
            <Divider borderColor="gray.900" />
            <Flex flexDir={["column", null, "row"]} gap={4}>
              <Input id="email" type="email" label="E-mail" {...register("email")} error={errors.email} />
              <InputGroup>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Senha"
                  {...register("password")}
                  error={errors.password}
                />
                <InputRightElement top={["8", "9"]} right="-2">
                  <IconButton
                    icon={showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    variant="unstyled"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowPassword(!showPassword)}
                    size="lg"
                    color="gray.600"
                  />
                </InputRightElement>
              </InputGroup>
            </Flex>
          </Stack>

          <Flex flexDir={["column", null, "column"]} alignItems="end">
            <Flex w="100%" flexDir={["column", null, "row"]} mr="auto" alignItems="end">
              <Button
                type="submit"
                mt="6"
                color="white"
                bg="green.400"
                _hover={{ bg: "green.600" }}
                size={["sm", "md"]}
                isLoading={isSubmitting || isExecutingRecaptcha}
                loadingText={isExecutingRecaptcha ? "Verificando..." : "Entrando..."}
                w={["100%", null, "3xs"]}
              >
                Entrar
              </Button>
              <Button
                type="button"
                variant="ghost"
                mt="6"
                color="gray.600"
                fontWeight="medium"
                size={["sm", "md"]}
                ml={2}
                onClick={() => router.push("/auth/forgot-password")}
              >
                Esqueci minha senha
              </Button>
            </Flex>
            <Box mt={[4, null, 4]} textAlign="center">
              <Text
                as="a"
                href="#"
                _hover={{
                  textDecoration: "underline"
                }}
                fontSize="smaller"
                display="flex"
                justifyContent="center"
                color="gray.600"
              >
                <RiAlertLine size={16} style={{ marginRight: "0.3rem", flexShrink: "0" }} />
                Se precisar de ajuda, entre em contato conosco.
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
        size="invisible"
        hl="pt-BR"
        badge="bottomright"
        id="recaptcha"
        onLoad={() => console.log("reCAPTCHA loaded")}
        onError={error => console.error("reCAPTCHA error:", error)}
      />
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  return redirectIfAuthenticated(ctx);
};
