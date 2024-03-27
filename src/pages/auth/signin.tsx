import * as yup from "yup";
import Link from "next/link";
import { Input } from "../../components/Form/Input";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn, signOut, useSession } from "next-auth/react";
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

    if (result?.ok) {
      router.replace("/dashboard");
      return;
    }

    alert("Credenciais inválidas");
  };

  const { data: session } = useSession();

  useEffect(() => {
    if (session === null) return;
    console.log("session.jwt...", session?.jwt);
  }, [session]);

  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center" flexDirection="column">
      <div className="">
        <h1>{session ? "Authenticated" : "Not authenticated"}</h1>
        <div className="">
          {session && (
            <>
              <h3>Session data</h3>
              <p>E-mail: {session.user.email}</p>
              <p>JWT from Strapi: Check console</p>
            </>
          )}
        </div>
        {session ? (
          <button onClick={() => signOut()}>Sign out</button>
        ) : (
          <Link href="/auth/signin">
            <button>Sign In</button>
          </Link>
        )}
      </div>

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
          <Text fontSize="3xl" fontWeight="bold" letterSpacing="tighter" w="64" align="center" margin="auto" h="12">
            SkateHub
            <Text color="green.400" as="span" ml="1">
              .
            </Text>
            <Text as="small" color="gray.700" ml="1" fontSize="smaller" fontWeight="300">
              dash
            </Text>
          </Text>
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
