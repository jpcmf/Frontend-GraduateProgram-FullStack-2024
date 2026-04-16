import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { RiAlertLine } from "react-icons/ri";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  Box,
  Button,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { TitleSection } from "@/components/TitleSection";
import { Toast } from "@/components/Toast";
import { CATEGORIES, getCategoryByValue } from "@/lib/const/categories";
import { REGEX_PATTERNS, VALIDATION_MESSAGES, VALIDATION_RULES } from "@/lib/const/validation";
import { signUpRequest } from "@/services/signUpRequest";
import { Input } from "@/shared/components/Form/Input";
import { Select } from "@/shared/components/Form/Select";
import { redirectIfAuthenticated } from "@/utils/auth";

const signUpSchema = z
  .object({
    name: z
      .string()
      .nonempty(VALIDATION_MESSAGES.REQUIRED)
      .min(VALIDATION_RULES.NAME.MIN_LENGTH, { message: VALIDATION_MESSAGES.NAME_TOO_SHORT }),
    email: z.string().nonempty(VALIDATION_MESSAGES.REQUIRED).email({ message: VALIDATION_MESSAGES.INVALID_EMAIL }),
    username: z
      .string()
      .nonempty(VALIDATION_MESSAGES.REQUIRED)
      .min(VALIDATION_RULES.USERNAME.MIN_LENGTH, { message: VALIDATION_MESSAGES.USERNAME_TOO_SHORT })
      .refine(value => !REGEX_PATTERNS.EMAIL.test(value), {
        message: VALIDATION_MESSAGES.USERNAME_IS_EMAIL
      }),
    category: z.enum(
      [
        "iniciante",
        "amador",
        "profissional",
        "pro-master",
        "pro-legend",
        "master",
        "grand-master",
        "grand-legend",
        "vintage",
        "open",
        "paraskatista"
      ],
      { errorMap: () => ({ message: VALIDATION_MESSAGES.REQUIRED }) }
    ),
    city: z.string().nonempty(VALIDATION_MESSAGES.REQUIRED),
    uf: z.string().nonempty(VALIDATION_MESSAGES.REQUIRED),
    country: z.string().nonempty(VALIDATION_MESSAGES.REQUIRED),
    password: z
      .string()
      .nonempty(VALIDATION_MESSAGES.REQUIRED)
      .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, { message: VALIDATION_MESSAGES.PASSWORD_TOO_SHORT }),
    confirmPassword: z.string().nonempty(VALIDATION_MESSAGES.REQUIRED)
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH,
        path: ["confirmPassword"]
      });
    }
  });

type SignUpSchema = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const route = useRouter();
  const { addToast } = Toast();
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isExecutingRecaptcha, setIsExecutingRecaptcha] = useState(false);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

  const bgColor = useColorModeValue("blackAlpha.100", "gray.800");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
    mode: "onChange"
  });

  const handleSignUp: SubmitHandler<SignUpSchema> = async values => {
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

      const selectedCategory2 = getCategoryByValue(values.category);

      const newValues = {
        name: values.name,
        email: values.email,
        username: values.username,
        category: selectedCategory2?.id,
        city: values.city,
        uf: values.uf,
        country: values.country,
        password: values.password,
        recaptcha: recaptchaValue || undefined
      };

      await signUpRequest(newValues);

      addToast({
        title: "Cadastro efetuado com sucesso.",
        message:
          "Você receberá um e-mail para confirmar o seu endereço de e-mail. Por favor, verifique sua caixa de entrada.",
        type: "success"
      });

      recaptchaRef.current?.reset();
      reset();

      setTimeout(() => {
        route.push("/");
      }, 3000);
    } catch (error: any) {
      recaptchaRef.current?.reset();

      if (error.response?.status === 400) {
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
    } finally {
      setIsExecutingRecaptcha(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cadastrar - SkateHub</title>
      </Head>
      <TitleSection title="Criar uma conta" />
      <Flex alignItems="center" flexDirection="column" height="100%" justifyContent="start" mb={8} width="100%">
        <Flex
          as="form"
          w="100%"
          bg={bgColor}
          p="8"
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(handleSignUp)}
        >
          <Stack spacing={4}>
            <Flex flexDir={["column", null, "row"]} gap="4">
              <Input
                id="name"
                type="text"
                label="Nome completo"
                placeholder="Digite seu nome completo"
                {...register("name")}
                error={errors.name}
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
                id="username"
                type="text"
                label="Usuário"
                placeholder="Digite seu nome de usuário"
                {...register("username")}
                error={errors.username}
              />
              <Select
                label="Categoria"
                placeholder="Selecione sua categoria"
                error={errors.category}
                {...register("category")}
              >
                {CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Flex>
            <Flex flexDir={["column", null, "row"]} gap="4">
              <Input
                id="city"
                type="text"
                label="Cidade"
                placeholder="Digite sua cidade"
                {...register("city")}
                error={errors.city}
              />
              <Input
                id="uf"
                type="text"
                label="Estado"
                placeholder="Digite seu estado"
                {...register("uf")}
                error={errors.uf}
              />
              <Input
                id="country"
                type="text"
                label="País"
                placeholder="Digite seu país"
                {...register("country")}
                error={errors.country}
              />
            </Flex>
            <Flex flexDir={["column", null, "row"]} gap="4">
              <InputGroup>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Senha"
                  placeholder="Digite uma senha"
                  {...register("password")}
                  error={errors.password}
                />
                <InputRightElement top={8} right="-2">
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
              <InputGroup>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirmar senha"
                  placeholder="Confirme a senha"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword}
                />
                <InputRightElement top={8} right="-2">
                  <IconButton
                    icon={showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    variant="unstyled"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

          <Flex flexDir={["column", null, "row"]} alignItems="end" mt={2}>
            <Button
              type="submit"
              color="white"
              bg="green.400"
              _hover={{ bg: "green.600" }}
              size={["sm", "md"]}
              isLoading={isSubmitting || isExecutingRecaptcha}
              isDisabled={!isRecaptchaReady}
              loadingText={isExecutingRecaptcha ? "Cadastrando..." : "Finalizando..."}
              w={["100%", null, "3xs"]}
              mr="auto"
            >
              Cadastrar
            </Button>
            <Box mt={[4, null, 0]} textAlign="center">
              <Text fontSize="smaller" display="flex" justifyContent="center" color="gray.600">
                <RiAlertLine size={16} style={{ marginRight: "0.3rem", flexShrink: "0" }} />
                Verifique sua caixa de entrada para o e-mail de confirmação.
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  return redirectIfAuthenticated(ctx);
};
