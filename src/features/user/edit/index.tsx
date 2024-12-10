import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Flex, Heading, Divider, SimpleGrid, VStack, HStack } from "@chakra-ui/react";
import { parseCookies } from "nookies";

import { Input } from "@/shared/components/Form/Input";
import { Toast } from "@/components/Toast";
import { Layout } from "@/shared/components/Layout";
import { Textarea } from "@/shared/components/Form/Textarea";
import { AuthContext } from "@/contexts/AuthContext";

type RegisterForm = {
  name: string;
  email: string;
  about: string;
  website_url: string;
  // password: string;
  // password_confirmation: string;
};

export function UserEdit() {
  const router = useRouter();
  const { addToast } = Toast();

  const { user, updateUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<RegisterForm>();

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const handleEditUser: SubmitHandler<RegisterForm> = async values => {
    try {
      await updateUser({
        id: user ? user.id : "",
        name: values.name,
        email: values.email,
        about: values.about,
        website_url: values.website_url
      });

      addToast({
        title: "Usuário editado com sucesso.",
        message: "Seu perfil foi atualizado.",
        type: "success"
      });
    } catch (error) {
      addToast({
        title: "Erro ao editar usuário.",
        message: `Ocorreu um erro ao editar seu perfil: ${error}`,
        type: "error"
      });
      console.log("Erro ao editar usuário:", error);
    }
  };

  return (
    <Layout>
      <Box as="form" onSubmit={handleSubmit(handleEditUser)} flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
        <Flex mb="8" direction="column">
          <Heading size="lg" fontWeight="normal">
            Editar
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="4">
            <SimpleGrid minChildWidth="240px" spacing="4" w="100%">
              <Input label="Nome completo" {...register("name")} error={errors.name} isDisabled />
              <Input type="email" label="E-mail" {...register("email")} error={errors.email} />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing="4" w="100%">
              <Flex flexDirection="column">
                <Textarea label="Sobre você" placeholder="Sobre você..." {...register("about")} error={errors.about} />
              </Flex>
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing="4" w="100%">
              <Input
                isInputGroup
                InputLeftAddonText="instagram.com/"
                label="Perfil Instagram"
                placeholder="Ex. nome_do_usuário"
              />
              <Input
                isInputGroup
                InputLeftAddonText="https://"
                label="Website Pessoal"
                placeholder="Ex. www.site.com.br"
                {...register("website_url")}
                error={errors.website_url}
              />
            </SimpleGrid>

            {/* <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input type="password" label="Senha" {...register("password")} error={errors.password} />
              <Input
                type="password"
                label="Confirmar senha"
                {...register("password_confirmation")}
                error={errors.password_confirmation}
              />
            </SimpleGrid> */}
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button
                as="a"
                size={["md", "lg"]}
                fontSize="sm"
                colorScheme="whiteAlpha"
                onClick={() => router.push("/dashboard")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                size={["md", "lg"]}
                fontSize="sm"
                colorScheme="green"
                isDisabled={!user?.email}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const { ["nextauth.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }
  return {
    props: {}
  };
};
