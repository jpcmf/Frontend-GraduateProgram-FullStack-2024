"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { Flex, Spinner, Text } from "@chakra-ui/react";

import { ListDetail, useList } from "@/features/lists";

type ListDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function ListDetailPage(props: ListDetailPageProps) {
  const params = use(props.params);
  const router = useRouter();
  const { id } = params;
  const { data, isLoading, isError } = useList(id);

  if (isLoading || !id) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  if (isError || !data?.data) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Text color="red.400">Lista não encontrada.</Text>
      </Flex>
    );
  }

  return <ListDetail list={data.data} onDelete={() => router.back()} />;
}
