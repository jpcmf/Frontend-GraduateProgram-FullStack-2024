import { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Head from "next/head";
import { useRouter } from "next/router";

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
  Text
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { LogoSkateHub } from "@/components/LogoSkateHub";
// import { useEffect } from "react";
// import { destroyCookie, parseCookies } from "nookies";
import { ReusableModal } from "@/components/ReusableModal";
import { Toast } from "@/components/Toast";
import { AuthContext } from "@/contexts/AuthContext";
import { SignInFormSchema, signInFormSchema } from "@/features/user/signInFormSchema";
import { Input } from "@/shared/components/Form/Input";
import { redirectIfAuthenticated } from "@/utils/auth";

import packageJson from "../../package.json";

export default function LoginPage() {
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
    console.log("handleSignIn...", values);

    // Execute invisible reCAPTCHA (works for both v2 invisible and v3)
    if (recaptchaRef.current) {
      try {
        setIsExecutingRecaptcha(true);
        // For v2 invisible, use executeAsync(). For v3, use execute()
        const recaptchaValue =
          (await recaptchaRef.current.executeAsync?.()) || (await recaptchaRef.current.execute?.());
        const newValues = { ...values, recaptcha: recaptchaValue || undefined };

        await signIn(newValues)
          .then(_ => {
            // Reset reCAPTCHA after successful login
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

  const handleClose = () => {
    router.back();
  };

  return (
    <ReusableModal isOpen={true} onClose={handleClose} title="Sign In" size="6xl">
      <Head>
        <title>Home - SkateHub</title>
      </Head>
      <Grid templateColumns={["1fr", "repeat(5, 1fr)"]} gap="0">
        <GridItem
          hideBelow="md"
          colSpan={{ md: 2, lg: 2, xl: 3 }}
          // h="580px"
          bg="gray.800"
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          backgroundBlendMode="overlay"
          backgroundPosition="center 15%"
          backgroundImage="./tom-morbey-unsplash-2.jpeg"
        >
          <Flex marginLeft="8" marginTop="5">
            <LogoSkateHub />
          </Flex>
        </GridItem>
        <GridItem
          colStart={{ base: 1, md: 3, lg: 3, xl: 4 }}
          colEnd={6}
          // h="580px"
          bg="gray.800"
        >
          <Stack
            spacing="4"
            py={["4", "8"]}
            px={["4", "12"]}
          // h="580px"
          >
            <Flex flexDir="column" flexGrow="1" alignItems="center" justifyContent="center">
              <Flex flexDir="column" w="100%" alignItems="center" mb="10">
                <Flex hideFrom="md" marginBottom="10">
                  <LogoSkateHub />
                </Flex>
                <Text fontWeight="bold" fontSize="3xl" align="center" color="gray.300">
                  Junte-se à comunidade! Faça parte da evolução do esporte.
                </Text>
                <Text mt="4" fontSize="lg" fontWeight="medium" align="center" color="gray.500">
                  Faça login ou cadastre-se para começar a explorar todas as funcionalidades.
                </Text>
              </Flex>
              <Flex alignItems="center" justifyContent="center" flexDirection="row" gap="3" w="100%">
                <Flex
                  as="form"
                  w="100%"
                  maxWidth={480}
                  // bg="gray.800"
                  p="0"
                  borderRadius={8}
                  flexDir="column"
                  onSubmit={handleSubmit(handleSignIn)}
                >
                  <Stack spacing={4}>
                    <Flex flexDir="column">
                      <Input
                        id="email"
                        type="email"
                        // label="E-mail"
                        placeholder="E-mail"
                        {...register("email")}
                        error={errors.email}
                      />
                    </Flex>
                    <Flex flexDir="column">
                      <InputGroup>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          // label="Senha"
                          placeholder="Senha"
                          {...register("password")}
                          error={errors.password}
                        />
                        <InputRightElement top={["8", "1"]} right="-2">
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

                    {/* <Flex flexDir="column">
                      <Box border="1px solid" bg="blackAlpha.50" borderColor="gray.900" borderRadius="md" p="4">
                        <Text fontSize="smaller" align="left">
                          Se precisar de ajuda, entre em{" "}
                          <Text as="a" href="#" textDecoration="underline" fontWeight="medium" color="gray.600">
                            contato conosco
                          </Text>
                          .
                        </Text>
                      </Box>
                    </Flex> */}

                    {/* Invisible reCAPTCHA - executes automatically when form is submitted */}
                    <Flex flexDir="column" alignItems="center">
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
                    </Flex>
                  </Stack>
                  <Button
                    type="submit"
                    mt="6"
                    colorScheme="green"
                    fontWeight="bold"
                    size={["md", "lg"]}
                    isLoading={isSubmitting || isExecutingRecaptcha}
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
                {/* <Button
                  type="button"
                  mt="3"
                  colorScheme="green"
                  fontWeight="bold"
                  size={["md", "lg"]}
                  w="100%"
                  onClick={() => router.push("/auth/signin")}
                >
                  Login
                </Button> */}
                <Button
                  type="button"
                  mt="3"
                  variant="ghost"
                  colorScheme="green"
                  fontWeight="bold"
                  size={["md", "lg"]}
                  w="100%"
                  onClick={() => router.push("/auth/signup")}
                >
                  Criar uma conta
                </Button>
              </Flex>
            </Flex>
            {/* <Flex alignItems="center" justifyContent="center" flexDirection="row">
              <Text
                as="a"
                href="#"
                color="gray.600"
                align="center"
                textDecoration="underline"
                fontSize="smaller"
                fontWeight="medium"
                maxWidth="200px"
                w="100%"
                textAlign="right"
              >
                Termos de uso
              </Text>
              <Text as="span" color="gray.600" paddingLeft="2" paddingRight="2" fontSize="smaller">
                |
              </Text>
              <Text
                as="a"
                href="#"
                color="gray.600"
                align="center"
                textDecoration="underline"
                fontSize="smaller"
                fontWeight="medium"
                maxWidth="200px"
                w="100%"
                textAlign="left"
              >
                Política de privacidade
              </Text>
            </Flex> */}
            <Flex position="absolute" bottom="2" right="3" hideBelow="sm">
              <Text as="small" fontSize="x-small" color="gray.700" align="center">
                versão {packageJson.version}
              </Text>
            </Flex>
          </Stack>
        </GridItem>
      </Grid>
    </ReusableModal>
  );
}

export const getServerSideProps = async (ctx: any) => {
  return redirectIfAuthenticated(ctx);
};
