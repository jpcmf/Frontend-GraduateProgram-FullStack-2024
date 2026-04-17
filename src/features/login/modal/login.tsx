"use client";

import { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { LogoSkateHub } from "@/components/LogoSkateHub";
import { Toast } from "@/components/Toast";
import { AuthContext } from "@/contexts/AuthContext";
import { SignInFormSchema, signInFormSchema } from "@/features/user/signInFormSchema";
import { Input } from "@/shared/components/Form/Input";
import { redirectIfAuthenticated } from "@/utils/auth";

import packageJson from "../../../../package.json";

export default function LoginModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useContext(AuthContext);
  const { addToast } = Toast();
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isExecutingRecaptcha, setIsExecutingRecaptcha] = useState(false);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const bgColorPrimaryButton = useColorModeValue("green.300", "green.400");
  const primaryTextColor = useColorModeValue("white", "gray.100");
  const textSecondaryButton = useColorModeValue("gray.800", "green.400");
  const titleTextColor = useColorModeValue("gray.800", "gray.100");
  const subTitleTextColor = useColorModeValue("gray.600", "gray.500");

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
    if (!recaptchaRef.current) {
      addToast({
        title: "Erro de verificação.",
        message: "Sistema de verificação não está disponível.",
        type: "error"
      });
      return;
    }

    if (!isRecaptchaReady) {
      addToast({
        title: "Aguarde.",
        message: "Sistema de verificação ainda está carregando. Tente novamente.",
        type: "warning"
      });
      return;
    }

    try {
      setIsExecutingRecaptcha(true);
      const recaptchaValue = await recaptchaRef.current.executeAsync();
      const newValues = { ...values, recaptcha: recaptchaValue || undefined };

      await signIn(newValues)
        .then(_ => {
          recaptchaRef.current?.reset();
          // Close the modal by removing the modal query param
          const params = new URLSearchParams(searchParams?.toString() || "");
          params.delete("modal");
          const newSearch = params.toString();
          router.push(newSearch ? `?${newSearch}` : "/");
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
    } catch {
      recaptchaRef.current?.reset();
      addToast({
        title: "Erro de verificação.",
        message: "Falha na verificação de segurança. Tente novamente.",
        type: "error"
      });
    } finally {
      setIsExecutingRecaptcha(false);
    }
  };

  return (
    <Grid templateColumns={["1fr", "repeat(5, 1fr)"]} gap="0">
      <GridItem
        hideBelow="md"
        colSpan={{ md: 2, lg: 2, xl: 3 }}
        bg={bgColor}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundBlendMode="overlay"
        backgroundPosition="center 15%"
        backgroundImage="./tom-morbey-unsplash-2.jpeg"
      >
        <Flex marginLeft="6" marginTop="6">
          <LogoSkateHub />
        </Flex>
      </GridItem>
      <GridItem colStart={{ base: 1, md: 3, lg: 3, xl: 4 }} colEnd={6} bgColor={bgColor}>
        <Stack spacing="4" py={["4", "8"]} px={["4", "12"]}>
          <Flex flexDir="column" flexGrow="1" alignItems="center" justifyContent="center">
            <Flex flexDir="column" w="100%" alignItems="center" mb="10">
              <Flex hideFrom="md" marginBottom="10" marginTop={6}>
                <LogoSkateHub />
              </Flex>
              <Text fontWeight="bold" fontSize={{ base: "xl", md: "3xl" }} align="center" color={titleTextColor}>
                Junte-se à comunidade! Faça parte da evolução do esporte.
              </Text>
              <Text
                mt="4"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="medium"
                align="center"
                color={subTitleTextColor}
              >
                Faça login ou cadastre-se para começar a explorar todas as funcionalidades.
              </Text>
            </Flex>
            <Flex alignItems="center" justifyContent="center" flexDirection="row" gap="3" w="100%">
              <Flex
                as="form"
                w="100%"
                maxWidth={480}
                p="0"
                borderRadius={8}
                flexDir="column"
                onSubmit={handleSubmit(handleSignIn)}
              >
                <Stack spacing={4}>
                  <Flex flexDir="column">
                    <Input id="email" type="email" placeholder="E-mail" {...register("email")} error={errors.email} />
                  </Flex>
                  <Flex flexDir="column">
                    <InputGroup>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        {...register("password")}
                        error={errors.password}
                      />
                      <InputRightElement top={0} right="-2">
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
                  <Flex flexDir="column" alignItems="center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                      size="invisible"
                      hl="pt-BR"
                      badge="bottomright"
                      id="recaptcha"
                      asyncScriptOnLoad={() => setIsRecaptchaReady(true)}
                    />
                  </Flex>
                </Stack>
                <Button
                  type="submit"
                  mt="6"
                  bg={bgColorPrimaryButton}
                  color={primaryTextColor}
                  _hover={{ bg: "green.600" }}
                  fontWeight="bold"
                  size={["sm", "md"]}
                  isLoading={isSubmitting || isExecutingRecaptcha}
                  isDisabled={!isRecaptchaReady}
                  loadingText={isExecutingRecaptcha ? "Verificando..." : "Entrando..."}
                >
                  Entrar
                </Button>
                <ChakraLink
                  onClick={() => router.push("/auth/forgot-password")}
                  color="gray.600"
                  mt="2"
                  fontSize="xs"
                  textAlign="right"
                  textDecoration="underline"
                  fontWeight="medium"
                >
                  Esqueci minha senha
                </ChakraLink>
              </Flex>
            </Flex>
            <Flex alignItems="center" justifyContent="center" flexDirection="row" gap="3" w="100%">
              <Button
                type="button"
                mt="3"
                variant="ghost"
                color={textSecondaryButton}
                fontWeight="bold"
                size={["sm", "md"]}
                w="100%"
                onClick={() => router.push("/auth/signup")}
              >
                Criar uma conta
              </Button>
            </Flex>
          </Flex>
          <Flex position="absolute" bottom="2" right="3">
            <Text as="small" fontSize="x-small" color="gray.700" align="center">
              versão {packageJson.version}
            </Text>
          </Flex>
        </Stack>
      </GridItem>
    </Grid>
  );
}

export const getServerSideProps = async (ctx: any) => {
  return redirectIfAuthenticated(ctx);
};
