import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Toast } from "@/components/Toast";
import { AuthContext } from "@/contexts/AuthContext";
import { Input } from "@/shared/components/Form/Input";
import { Select } from "@/shared/components/Form/Select";
import { Textarea } from "@/shared/components/Form/Textarea";

type RegisterForm = {
  name: string;
  email: string;
  username: string;
  categoryValue: string;
  about: string;
  website_url: string;
  instagram_url: string;
  //TODO: implement password change
  // password: string;
  // password_confirmation: string;
};

const UserEditFormSchema = z.object({
  name: z.string().min(1, "Campo obrigatório."),
  email: z.string().email("E-mail inválido.").min(1, "Campo obrigatório."),
  username: z.string().min(1, "Campo obrigatório."),
  categoryValue: z.string().nonempty("Campo obrigatório."),
  about: z.string().max(255, "Máximo de 255 caracteres."),
  website_url: z.string(),
  instagram_url: z.string()
});

type UserEditFormSchema = z.infer<typeof UserEditFormSchema>;

const CATEGORIES = [
  { id: 1, name: "Iniciante", value: "iniciante" },
  { id: 2, name: "Amador", value: "amador" },
  { id: 3, name: "Profissional", value: "profissional" },
  { id: 4, name: "Pro Master", value: "pro-master" },
  { id: 5, name: "Pro Legend", value: "pro-legend" },
  { id: 6, name: "Master", value: "master" },
  { id: 7, name: "Grand Master", value: "grand-master" },
  { id: 8, name: "Grand Legend", value: "grand-legend" },
  { id: 9, name: "Vintage", value: "vintage" },
  { id: 10, name: "Open", value: "open" },
  { id: 11, name: "Paraskatista", value: "paraskatista" }
];

export function UserEdit() {
  const router = useRouter();
  const { addToast } = Toast();
  const [isError, setIsError] = useState(false);
  const { user, updateUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<UserEditFormSchema>({
    resolver: zodResolver(UserEditFormSchema),
    mode: "onChange"
  });

  useEffect(() => {
    if (user) {
      // reset(user);
      reset({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        categoryValue: user.category?.value || "",
        about: user.about || "",
        website_url: user.website_url || "",
        instagram_url: user.instagram_url || ""
      });
    }
  }, [user, reset]);

  const handleEditUser: SubmitHandler<RegisterForm> = async values => {
    try {
      const selectedCategory = CATEGORIES.find(cat => cat.value === values.categoryValue);

      if (!selectedCategory) {
        throw new Error("Categoria inválida");
      }

      await updateUser({
        id: user ? user.id : "",
        name: values.name,
        username: user ? user.username : "",
        category: {
          id: selectedCategory.id,
          name: selectedCategory.name,
          value: selectedCategory.value
        },
        email: values.email,
        about: values.about,
        website_url: values.website_url,
        instagram_url: values.instagram_url
      });
      addToast({
        title: "Usuário editado com sucesso.",
        message: "Seu perfil foi atualizado.",
        type: "success"
      });
      setIsError(false);
    } catch (error: any) {
      addToast({
        title: "Erro ao editar usuário.",
        message: `Ocorreu um erro ao editar seu perfil: ${error.response.data.error.message}`,
        type: "error"
      });
      console.error(error);
      setIsError(true);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleEditUser)}
      flex="1"
      borderRadius={8}
      bg="gray.800"
      p={["6", "8"]}
      mb={8}
    >
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
            <Input label="Usuário" {...register("username")} error={errors.username} isDisabled />
            <Select
              label="Categoria"
              placeholder="Selecione sua categoria"
              error={errors.categoryValue}
              {...register("categoryValue")}
            >
              {CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.name}
                </option>
              ))}
            </Select>
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
              {...register("instagram_url")}
              error={errors.instagram_url}
              isInvalid={isError}
            />
            <Input
              isInputGroup
              InputLeftAddonText="https://"
              label="Website Pessoal"
              placeholder="Ex. www.site.com.br"
              {...register("website_url")}
              error={errors.website_url}
              isInvalid={isError}
            />
          </SimpleGrid>
          {/* TODO: implement password change */}
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
  );
}
