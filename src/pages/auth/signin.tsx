import * as yup from "yup";
import { Input } from "../../components/Form/Input";
import { Toast } from "@/components/Toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { LogoSkateHub } from "@/components/LogoSkateHub";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Flex, Stack, Text } from "@chakra-ui/react";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup.string().required("Password obrigatório")
});

export default function SignIn() {
  const router = useRouter();
  const { addToast } = Toast();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  });

  const { errors } = formState;

  const handleSignIn: SubmitHandler<SignInFormData> = async values => {
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password
    });

    if (result?.status === 200) {
      router.replace("/dashboard");
      return;
    } else {
      addToast({
        title: "Erro de autenticação.",
        message: "Verifique seus dados de login e tente novamente.",
        type: "error"
      });
    }
  };

  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center" flexDirection="column">
      <Flex
        as="form"
        w="100%"
        maxWidth={360}
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
            <Input id="email" type="email" label="E-mail" {...register("email")} error={errors.email} />
          </Flex>
          <Flex flexDir="column">
            <Input id="password" type="password" label="Senha" {...register("password")} error={errors.password} />
          </Flex>
        </Stack>
        <Button type="submit" mt="6" colorScheme="green" size="lg" isLoading={formState.isSubmitting}>
          Entrar
        </Button>
        <Text as="a" href="#" color="gray.600" mt="4" align={"center"} textDecoration={"underline"}>
          Esqueci minha senha
        </Text>
      </Flex>
    </Flex>
  );
}
