import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";

import { Box, Button, Flex, HStack, SimpleGrid, useColorModeValue, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ProfileHeader } from "@/components/HeaderProfile";
import { TitleSection } from "@/components/TitleSection";
import { Toast } from "@/components/Toast";
import { AuthContext } from "@/contexts/AuthContext";
import { VALIDATION_MESSAGES, VALIDATION_RULES } from "@/lib/const";
import { CATEGORIES } from "@/lib/const/categories";
import { Input } from "@/shared/components/Form/Input";
import { Select } from "@/shared/components/Form/Select";
import { Textarea } from "@/shared/components/Form/Textarea";

// type RegisterForm = {
//   name: string;
//   email: string;
//   username: string;
//   categoryValue: string;
//   about: string;
//   website_url: string;
//   instagram_url: string;
//   //TODO: implement password change
//   // password: string;
//   // password_confirmation: string;
// };

const UserEditFormSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL).min(1, VALIDATION_MESSAGES.REQUIRED),
  username: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  categoryValue: z.string().nonempty(VALIDATION_MESSAGES.REQUIRED),
  about: z.string().max(VALIDATION_RULES.ABOUT.MAX_LENGTH, VALIDATION_MESSAGES.ABOUT_MAX_LENGTH),
  website_url: z.string(),
  instagram_url: z.string()
});

type UserEditFormSchema = z.infer<typeof UserEditFormSchema>;

export function UserEdit() {
  const router = useRouter();
  const { addToast } = Toast();
  const [isError, setIsError] = useState(false);
  const { user, updateUser } = useContext(AuthContext);

  const bgColor = useColorModeValue("blackAlpha.100", "gray.800");
  const bgCancelButton = useColorModeValue("whiteAlpha.100", "blackAlpha.300");

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

  const handleEditUser: SubmitHandler<UserEditFormSchema> = async values => {
    if (!user?.id) return;

    try {
      const selectedCategory = CATEGORIES.find(cat => cat.value === values.categoryValue);

      if (!selectedCategory) {
        throw new Error("Categoria inválida");
      }

      await updateUser({
        id: user.id,
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
    <>
      <TitleSection title="Editar" />

      {user && <ProfileHeader user={user} variant="edit" />}
      <Box as="form" onSubmit={handleSubmit(handleEditUser)} flex="1" borderRadius={8} bg={bgColor} p={["4", "8"]}>
        <Flex mb="8" direction="column">
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
                size="md"
              />
              <Input
                isInputGroup
                InputLeftAddonText="https://"
                label="Website pessoal"
                placeholder="Ex. www.site.com.br"
                {...register("website_url")}
                error={errors.website_url}
                isInvalid={isError}
                size="md"
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
              <Button cursor="pointer" as="a" size="md" bg={bgCancelButton} onClick={() => router.push("/dashboard")}>
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                size="md"
                color="white"
                bg="green.400"
                isDisabled={!user?.email}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
