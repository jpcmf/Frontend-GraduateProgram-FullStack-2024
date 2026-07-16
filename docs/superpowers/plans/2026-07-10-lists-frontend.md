# Lists (Collections) Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the frontend UI for typed user lists (wish/like/want/recommend), including public discovery, public detail, dashboard management, and profile integration.

**Architecture:** New `lists` feature following Vertical Slice Architecture (VSA) — co-located types, services, hooks, and components. Pages use `(public)` and `(protected)` route groups. Data flows through TanStack Query with cache invalidation on mutations.

**Tech Stack:** Next.js 16 (App Router), React 19, Chakra UI v3, TanStack Query v5, custom `apiClient` Axios instance

## Corrections to `specs/lists.md`

The frontend spec was written before the backend was finalized. These corrections apply:

| Spec says                  | Actual                                     |
| -------------------------- | ------------------------------------------ |
| `/api/lists`               | `/api/user-lists`                          |
| `/api/list-items`          | `/api/user-list-items`                     |
| `created_by_user` relation | `owner` relation                           |
| `middleware.ts` protection | `(protected)/layout.tsx` client-side guard |
| `User.lists` field         | `User.user_lists` field                    |

## File Structure

```
src/features/lists/
├── types/
│   └── lists.ts                            # All list-related types
├── services/
│   ├── getLists.ts                         # GET /api/user-lists (public discovery)
│   ├── getListById.ts                      # GET /api/user-lists/:id (detail)
│   ├── getListsByUser.ts                   # GET /api/user-lists?filters[owner][$eq]
│   ├── createList.ts                       # POST /api/user-lists
│   ├── updateList.ts                       # PUT /api/user-lists/:id
│   ├── deleteList.ts                       # DELETE /api/user-lists/:id
│   ├── createListItem.ts                   # POST /api/user-list-items
│   ├── updateListItem.ts                   # PUT /api/user-list-items/:id
│   └── deleteListItem.ts                   # DELETE /api/user-list-items/:id
├── hooks/
│   ├── useLists.ts                         # useQuery — key: ["lists"]
│   ├── useList.ts                          # useQuery — key: ["lists", id]
│   ├── useListsByUser.ts                   # useQuery — key: ["my-lists"]
│   ├── useCreateList.ts                    # useMutation — invalidates ["lists"], ["my-lists"]
│   ├── useUpdateList.ts                    # useMutation — invalidates ["lists"], ["my-lists"], ["lists", id]
│   ├── useDeleteList.ts                    # useMutation — invalidates ["lists"], ["my-lists"]
│   ├── useCreateListItem.ts               # useMutation — invalidates ["lists", listId]
│   ├── useUpdateListItem.ts               # useMutation — invalidates ["lists", listId]
│   └── useDeleteListItem.ts               # useMutation — invalidates ["lists", listId]
├── components/
│   ├── ListCard/index.tsx                  # Card for public discovery + profile grid
│   ├── ListDetail/index.tsx                # Detail view for /lists/[id]
│   ├── CreateListModal/index.tsx           # Modal for quick create from dashboard
│   ├── ListForm/index.tsx                  # Shared create/edit form
│   ├── ListItemForm/index.tsx              # Modal for add/edit items
│   └── ListItemList/index.tsx              # Items list with edit/delete buttons
└── index.ts                                # Barrel export

src/app/(public)/lists/
├── page.tsx                                # Public discovery page
└── [id]/page.tsx                           # Public detail page

src/app/(protected)/dashboard/lists/
├── page.tsx                                # Dashboard lists management
└── [id]/edit/page.tsx                      # Edit list with item management
```

---

## Task 1: Create List Types

**Files:**

- Create: `src/features/lists/types/lists.ts`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p src/features/lists/types src/features/lists/services src/features/lists/hooks src/features/lists/components/ListCard src/features/lists/components/ListDetail src/features/lists/components/CreateListModal src/features/lists/components/ListForm src/features/lists/components/ListItemForm src/features/lists/components/ListItemList
```

- [ ] **Step 2: Write types file**

```typescript
export type ListType = "wish" | "like" | "want" | "recommend";

export type ListItemAttributes = {
  name: string;
  description: string | null;
  external_url: string | null;
  image: { data: { id: number; attributes: { url: string; formats?: { thumbnail?: { url: string } } } } | null };
  createdAt: string;
  updatedAt: string;
};

export type ListItem = {
  id: number;
  attributes: ListItemAttributes;
};

export type ListAttr = {
  title: string;
  type: ListType;
  createdAt: string;
  updatedAt: string;
  owner?: {
    data: {
      id: number;
      attributes: { username: string; name: string; avatar?: { data: { attributes: { url: string } } | null } };
    } | null;
  };
  items?: { data: ListItem[] };
};

export type List = {
  id: number;
  attributes: ListAttr;
};

export type ListsResponse = {
  data: List[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
};

export type ListResponse = {
  data: List;
};

export type CreateListPayload = {
  title: string;
  type: ListType;
};

export type UpdateListPayload = Partial<CreateListPayload>;

// CreateListItemPayload is defined in services/createListItem.ts (includes optional image field for upload)
export type UpdateListItemPayload = {
  name?: string;
  description?: string;
  external_url?: string;
};
```

---

## Task 2: Create List Services

**Files:**

- Create: `src/features/lists/services/getLists.ts`
- Create: `src/features/lists/services/getListById.ts`
- Create: `src/features/lists/services/getListsByUser.ts`
- Create: `src/features/lists/services/createList.ts`
- Create: `src/features/lists/services/updateList.ts`
- Create: `src/features/lists/services/deleteList.ts`
- Create: `src/features/lists/services/createListItem.ts`
- Create: `src/features/lists/services/updateListItem.ts`
- Create: `src/features/lists/services/deleteListItem.ts`

- [ ] **Step 1: Create getLists.ts**

```typescript
import { apiClient } from "@/shared/api/apiClient";
import type { ListsResponse } from "../types/lists";

const POPULATE =
  "?populate[owner][fields][0]=username" +
  "&populate[owner][fields][1]=name" +
  "&populate[owner][populate][avatar]=true" +
  "&populate[items]=true";

export async function getLists(): Promise<ListsResponse> {
  const res = await apiClient.get(`/api/user-lists${POPULATE}`);
  return res.data;
}
```

- [ ] **Step 2: Create getListById.ts**

```typescript
import { apiClient } from "@/shared/api/apiClient";
import type { ListResponse } from "../types/lists";

const POPULATE =
  "&populate[owner][fields][0]=username" +
  "&populate[owner][fields][1]=name" +
  "&populate[owner][populate][avatar]=true" +
  "&populate[items]=true";

export async function getListById(id: string | number): Promise<ListResponse> {
  const res = await apiClient.get(`/api/user-lists/${id}?${POPULATE}`);
  return res.data;
}
```

- [ ] **Step 3: Create getListsByUser.ts**

```typescript
import { apiClient } from "@/shared/api/apiClient";
import type { ListsResponse } from "../types/lists";

export async function getListsByUser(userId: string | number): Promise<ListsResponse> {
  const res = await apiClient.get(`/api/user-lists?filters[owner][$eq]=${userId}&populate[items]=true`);
  return res.data;
}
```

- [ ] **Step 4: Create createList.ts**

```typescript
import { apiClient } from "@/shared/api/apiClient";
import type { CreateListPayload, ListResponse } from "../types/lists";

export async function createList(payload: CreateListPayload): Promise<ListResponse> {
  const res = await apiClient.post("/api/user-lists", { data: payload });
  return res.data;
}
```

- [ ] **Step 5: Create updateList.ts**

```typescript
import { apiClient } from "@/shared/api/apiClient";
import type { UpdateListPayload, ListResponse } from "../types/lists";

export async function updateList(id: string | number, payload: UpdateListPayload): Promise<ListResponse> {
  const res = await apiClient.put(`/api/user-lists/${id}`, { data: payload });
  return res.data;
}
```

- [ ] **Step 6: Create deleteList.ts**

```typescript
import { apiClient } from "@/shared/api/apiClient";

export async function deleteList(id: string | number): Promise<void> {
  await apiClient.delete(`/api/user-lists/${id}`);
}
```

- [ ] **Step 7: Create createListItem.ts**

```typescript
import { apiClient } from "@/shared/api/apiClient";

export type CreateListItemPayload = {
  name: string;
  description?: string;
  external_url?: string;
  list: number;
  image?: File;
};

export async function createListItem(payload: CreateListItemPayload): Promise<void> {
  if (payload.image) {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        name: payload.name,
        description: payload.description,
        external_url: payload.external_url,
        list: payload.list
      })
    );
    formData.append("files.image", payload.image);
    await apiClient.post("/api/user-list-items", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  } else {
    await apiClient.post("/api/user-list-items", { data: payload });
  }
}
```

Note: The `CreateListItemPayload` type with `image` is defined here instead of in the types file to keep the Upload type local (FormData). The types file version omits `image` since it's only relevant when uploading.

- [ ] **Step 8: Create updateListItem.ts**

```typescript
import { apiClient } from "@/shared/api/apiClient";
import type { UpdateListItemPayload } from "../types/lists";

export async function updateListItem(id: string | number, payload: UpdateListItemPayload): Promise<void> {
  const res = await apiClient.put(`/api/user-list-items/${id}`, { data: payload });
  return res.data;
}
```

- [ ] **Step 9: Create deleteListItem.ts**

```typescript
import { apiClient } from "@/shared/api/apiClient";

export async function deleteListItem(id: string | number): Promise<void> {
  await apiClient.delete(`/api/user-list-items/${id}`);
}
```

---

## Task 3: Create List Hooks

**Files:**

- Create: `src/features/lists/hooks/useLists.ts`
- Create: `src/features/lists/hooks/useList.ts`
- Create: `src/features/lists/hooks/useListsByUser.ts`
- Create: `src/features/lists/hooks/useCreateList.ts`
- Create: `src/features/lists/hooks/useUpdateList.ts`
- Create: `src/features/lists/hooks/useDeleteList.ts`
- Create: `src/features/lists/hooks/useCreateListItem.ts`
- Create: `src/features/lists/hooks/useUpdateListItem.ts`
- Create: `src/features/lists/hooks/useDeleteListItem.ts`

- [ ] **Step 1: Create useLists.ts**

```typescript
import { useQuery } from "@tanstack/react-query";
import { getLists } from "../services/getLists";
import type { ListsResponse } from "../types/lists";

export function useLists() {
  return useQuery<ListsResponse, Error>({
    queryKey: ["lists"],
    queryFn: getLists,
    staleTime: 1000 * 60 * 5
  });
}
```

- [ ] **Step 2: Create useList.ts**

```typescript
import { useQuery } from "@tanstack/react-query";
import { getListById } from "../services/getListById";
import type { ListResponse } from "../types/lists";

export function useList(id: string | number | undefined) {
  return useQuery<ListResponse, Error>({
    queryKey: ["lists", id],
    queryFn: () => getListById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  });
}
```

- [ ] **Step 3: Create useListsByUser.ts**

```typescript
import { useQuery } from "@tanstack/react-query";
import { getListsByUser } from "../services/getListsByUser";
import type { ListsResponse } from "../types/lists";

export function useListsByUser(userId: string | number | undefined) {
  return useQuery<ListsResponse, Error>({
    queryKey: ["my-lists", userId],
    queryFn: () => getListsByUser(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5
  });
}
```

- [ ] **Step 4: Create useCreateList.ts**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createList } from "../services/createList";
import type { CreateListPayload, ListResponse } from "../types/lists";

export function useCreateList() {
  const queryClient = useQueryClient();
  return useMutation<ListResponse, Error, CreateListPayload>({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["my-lists"] });
    }
  });
}
```

- [ ] **Step 5: Create useUpdateList.ts**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateList } from "../services/updateList";
import type { UpdateListPayload, ListResponse } from "../types/lists";

export function useUpdateList(id: string | number) {
  const queryClient = useQueryClient();
  return useMutation<ListResponse, Error, UpdateListPayload>({
    mutationFn: payload => updateList(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["my-lists"] });
      queryClient.invalidateQueries({ queryKey: ["lists", id] });
    }
  });
}
```

- [ ] **Step 6: Create useDeleteList.ts**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteList } from "../services/deleteList";

export function useDeleteList() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string | number>({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["my-lists"] });
    }
  });
}
```

- [ ] **Step 7: Create useCreateListItem.ts**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createListItem } from "../services/createListItem";
import type { CreateListItemPayload } from "../services/createListItem";

export function useCreateListItem(listId: string | number) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, CreateListItemPayload>({
    mutationFn: createListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", listId] });
    }
  });
}
```

- [ ] **Step 8: Create useUpdateListItem.ts**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateListItem } from "../services/updateListItem";
import type { UpdateListItemPayload } from "../types/lists";

export function useUpdateListItem(listId: string | number) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string | number; data: UpdateListItemPayload }>({
    mutationFn: ({ id, data }) => updateListItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", listId] });
    }
  });
}
```

- [ ] **Step 9: Create useDeleteListItem.ts**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteListItem } from "../services/deleteListItem";

export function useDeleteListItem(listId: string | number) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string | number>({
    mutationFn: deleteListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", listId] });
    }
  });
}
```

---

## Task 4: Create List Components

**Files:**

- Create: `src/features/lists/components/ListCard/index.tsx`
- Create: `src/features/lists/components/ListDetail/index.tsx`
- Create: `src/features/lists/components/CreateListModal/index.tsx`
- Create: `src/features/lists/components/ListForm/index.tsx`
- Create: `src/features/lists/components/ListItemForm/index.tsx`
- Create: `src/features/lists/components/ListItemList/index.tsx`

- [ ] **Step 1: Create ListCard component**

```typescript
import NextLink from "next/link";
import { Badge, Box, Flex, Text, VStack } from "@chakra-ui/react";
import { useColors } from "@/shared/hooks/useColors";
import type { List, ListType } from "../../types/lists";

const TYPE_LABELS: Record<ListType, string> = {
  wish: "Desejo",
  like: "Curti",
  want: "Quero",
  recommend: "Recomendo",
};

const TYPE_COLORS: Record<ListType, string> = {
  wish: "purple",
  like: "green",
  want: "orange",
  recommend: "blue",
};

interface ListCardProps {
  list: List;
}

export function ListCard({ list }: ListCardProps) {
  const { bgColor, textMuted } = useColors();
  const { title, type, items, owner } = list.attributes;
  const itemCount = items?.data?.length ?? 0;
  const creatorName = owner?.data?.attributes?.username ?? "Desconhecido";

  return (
    <Box
      as={NextLink}
      href={`/lists/${list.id}`}
      display="block"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s" }}
      transition="transform 0.2s"
    >
      <VStack align="start" spacing={2} p={4}>
        <Badge colorScheme={TYPE_COLORS[type]} px={2} py={0} borderRadius="full">
          {TYPE_LABELS[type]}
        </Badge>
        <Text fontWeight="semibold" fontSize="md" noOfLines={1}>
          {title}
        </Text>
        <Flex align="center" gap={1}>
          <Text fontSize="sm" color={textMuted}>
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </Text>
          <Text fontSize="sm" color={textMuted}>
            · {creatorName}
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
}
```

- [ ] **Step 2: Create ListDetail component**

```typescript
import NextLink from "next/link";
import NextImage from "next/image";
import { Badge, Box, Button, Flex, Heading, Icon, Spinner, Text, VStack } from "@chakra-ui/react";
import { RiDeleteBinLine, RiEditLine, RiExternalLinkLine } from "react-icons/ri";
import { useColors } from "@/shared/hooks/useColors";
import { useAuth } from "@/shared/hooks/useAuth";
import { useDeleteList } from "../../hooks/useDeleteList";
import type { List, ListItem, ListType } from "../../types/lists";

const TYPE_LABELS: Record<ListType, string> = {
  wish: "Desejo",
  like: "Curti",
  want: "Quero",
  recommend: "Recomendo",
};

const TYPE_COLORS: Record<ListType, string> = {
  wish: "purple",
  like: "green",
  want: "orange",
  recommend: "blue",
};

interface ListDetailProps {
  list: List;
  onDelete?: () => void;
}

export function ListDetail({ list, onDelete }: ListDetailProps) {
  const { user } = useAuth();
  const { cardBg, textMuted, borderColor } = useColors();
  const deleteList = useDeleteList();
  const { title, type, items, owner } = list.attributes;
  const itemCount = items?.data?.length ?? 0;

  const isOwner = user && owner?.data?.id
    ? String(user.id) === String(owner.data.id)
    : false;

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta lista?")) {
      await deleteList.mutateAsync(list.id);
      onDelete?.();
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
        <Box>
          <Badge colorScheme={TYPE_COLORS[type]} px={3} py={1} borderRadius="full" mb={2}>
            {TYPE_LABELS[type]}
          </Badge>
          <Heading size="lg">{title}</Heading>
          <Flex align="center" gap={2} mt={1}>
            <Text fontSize="sm" color={textMuted}>
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </Text>
            {owner?.data && (
              <Text fontSize="sm" color={textMuted}>
                · por{" "}
                <Box as={NextLink} href={`/skatistas/${owner.data.attributes.username}`} color="green.400" _hover={{ textDecoration: "underline" }}>
                  {owner.data.attributes.username}
                </Box>
              </Text>
            )}
          </Flex>
        </Box>
        {isOwner && (
          <Flex gap={2}>
            <Button as={NextLink} href={`/dashboard/lists/${list.id}/edit`} leftIcon={<Icon as={RiEditLine} />} size="sm" colorScheme="green" variant="outline">
              Editar
            </Button>
            <Button leftIcon={<Icon as={RiDeleteBinLine} />} size="sm" colorScheme="red" variant="outline" onClick={handleDelete} isLoading={deleteList.isPending}>
              Excluir
            </Button>
          </Flex>
        )}
      </Flex>

      {items?.data && items.data.length > 0 ? (
        <VStack spacing={4} align="stretch">
          {items.data.map((item) => (
            <ListItemRow key={item.id} item={item} />
          ))}
        </VStack>
      ) : (
        <Text color={textMuted} textAlign="center" py={12}>
          Nenhum item nesta lista ainda.
        </Text>
      )}
    </Box>
  );
}

function ListItemRow({ item }: { item: ListItem }) {
  const { cardBg, textMuted, borderColor } = useColors();
  const { name, description, external_url, image } = item.attributes;
  const imageUrl = image?.data?.attributes?.formats?.thumbnail?.url ?? image?.data?.attributes?.url ?? null;

  return (
    <Flex
      bg={cardBg}
      borderRadius="lg"
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      gap={4}
      p={4}
      align="center"
    >
      {imageUrl && (
        <Box position="relative" w="80px" h="80px" flexShrink={0} borderRadius="md" overflow="hidden">
          <NextImage src={imageUrl} alt={name} fill style={{ objectFit: "cover" }} sizes="80px" />
        </Box>
      )}
      <Box flex={1}>
        <Text fontWeight="semibold">{name}</Text>
        {description && (
          <Text fontSize="sm" color={textMuted} noOfLines={2}>
            {description}
          </Text>
        )}
        {external_url && (
          <Flex as={NextLink} href={external_url} target="_blank" align="center" gap={1} mt={1} color="green.400" fontSize="sm">
            <Icon as={RiExternalLinkLine} />
            <Text textDecoration="underline">Ver original</Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
```

- [ ] **Step 3: Create CreateListModal component**

```typescript
import { useRouter } from "next/navigation";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useCreateList } from "../../hooks/useCreateList";
import type { ListType } from "../../types/lists";

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateListModal({ isOpen, onClose }: CreateListModalProps) {
  const router = useRouter();
  const toast = useToast();
  const createList = useCreateList();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ListType | "">("");
  const [errors, setErrors] = useState<{ title?: string; type?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; type?: string } = {};
    if (!title.trim()) newErrors.title = "Título é obrigatório";
    if (!type) newErrors.type = "Tipo é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const result = await createList.mutateAsync({ title: title.trim(), type: type as ListType });
      toast({ title: "Lista criada!", status: "success" });
      onClose();
      router.push(`/dashboard/lists/${result.data.id}/edit`);
    } catch {
      toast({ title: "Erro ao criar lista", status: "error" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Criar Lista</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!errors.title} mb={4}>
            <FormLabel>Título</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Melhores marcas de shape" />
            <FormErrorMessage>{errors.title}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.type}>
            <FormLabel>Tipo</FormLabel>
            <Select value={type} onChange={(e) => setType(e.target.value as ListType)} placeholder="Selecione o tipo">
              <option value="wish">Desejo</option>
              <option value="like">Curti</option>
              <option value="want">Quero</option>
              <option value="recommend">Recomendo</option>
            </Select>
            <FormErrorMessage>{errors.type}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="green" onClick={handleSubmit} isLoading={createList.isPending}>
            Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
```

- [ ] **Step 4: Create ListForm component**

```typescript
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import type { List, ListType } from "../../types/lists";

interface ListFormProps {
  initialData?: List;
  onSubmit: (data: { title: string; type: ListType }) => Promise<void>;
  isLoading: boolean;
}

export function ListForm({ initialData, onSubmit, isLoading }: ListFormProps) {
  const [title, setTitle] = useState(initialData?.attributes?.title ?? "");
  const [type, setType] = useState<ListType | "">(initialData?.attributes?.type ?? "");
  const [errors, setErrors] = useState<{ title?: string; type?: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.attributes.title);
      setType(initialData.attributes.type);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { title?: string; type?: string } = {};
    if (!title.trim()) newErrors.title = "Título é obrigatório";
    if (!type) newErrors.type = "Tipo é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ title: title.trim(), type: type as ListType });
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
      <FormControl isInvalid={!!errors.title}>
        <FormLabel>Título</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Melhores marcas de shape" />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.type}>
        <FormLabel>Tipo</FormLabel>
        <Select value={type} onChange={(e) => setType(e.target.value as ListType)} placeholder="Selecione o tipo">
          <option value="wish">Desejo</option>
          <option value="like">Curti</option>
          <option value="want">Quero</option>
          <option value="recommend">Recomendo</option>
        </Select>
        <FormErrorMessage>{errors.type}</FormErrorMessage>
      </FormControl>
      <Button type="submit" colorScheme="green" isLoading={isLoading} alignSelf="flex-start">
        Salvar
      </Button>
    </VStack>
  );
}
```

- [ ] **Step 5: Create ListItemForm component**

```typescript
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useCreateListItem, useUpdateListItem } from "../../hooks/useCreateListItem";
import type { ListItem } from "../../types/lists";

interface ListItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string | number;
  listItem?: ListItem;
}

export function ListItemForm({ isOpen, onClose, listId, listItem }: ListItemFormProps) {
  const toast = useToast();
  const createItem = useCreateListItem(listId);
  const updateItem = useUpdateListItem(listId);
  const isEditing = !!listItem;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(listItem?.attributes?.name ?? "");
  const [description, setDescription] = useState(listItem?.attributes?.description ?? "");
  const [externalUrl, setExternalUrl] = useState(listItem?.attributes?.external_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const validate = () => {
    if (!name.trim()) {
      setErrors({ name: "Nome é obrigatório" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (isEditing) {
        await updateItem.mutateAsync({
          id: listItem.id,
          data: { name: name.trim(), description: description.trim() || undefined, external_url: externalUrl.trim() || undefined },
        });
      } else {
        await createItem.mutateAsync({
          name: name.trim(),
          description: description.trim() || undefined,
          external_url: externalUrl.trim() || undefined,
          list: Number(listId),
          image: imageFile ?? undefined,
        });
      }
      toast({ title: isEditing ? "Item atualizado!" : "Item adicionado!", status: "success" });
      onClose();
    } catch {
      toast({ title: "Erro ao salvar item", status: "error" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? "Editar Item" : "Adicionar Item"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!errors.name} mb={4}>
            <FormLabel>Nome</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Spitfire OG Classic 99A" />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          {!isEditing && (
            <FormControl mb={4}>
              <FormLabel>Imagem</FormLabel>
              <Input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              {imageFile && <Text fontSize="sm" color="gray.400" mt={1}>{imageFile.name}</Text>}
            </FormControl>
          )}
          <FormControl mb={4}>
            <FormLabel>Descrição</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição opcional" />
          </FormControl>
          <FormControl>
            <FormLabel>URL</FormLabel>
            <Input value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://..." />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="green" onClick={handleSubmit} isLoading={createItem.isPending || updateItem.isPending}>
            {isEditing ? "Atualizar" : "Adicionar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
```

- [ ] **Step 6: Create ListItemList component**

```typescript
import NextImage from "next/image";
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RiDeleteBinLine, RiEditLine, RiExternalLinkLine } from "react-icons/ri";
import { useColors } from "@/shared/hooks/useColors";
import type { ListItem } from "../../types/lists";

interface ListItemListProps {
  items: ListItem[];
  onEdit: (item: ListItem) => void;
  onDelete: (item: ListItem) => void;
}

export function ListItemList({ items, onEdit, onDelete }: ListItemListProps) {
  const { cardBg, textMuted, borderColor } = useColors();

  return (
    <VStack spacing={3} align="stretch">
      {items.map((item) => {
        const imageUrl = item.attributes.image?.data?.attributes?.formats?.thumbnail?.url ?? item.attributes.image?.data?.attributes?.url ?? null;
        return (
          <Flex
            key={item.id}
            bg={cardBg}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            p={4}
            align="center"
            gap={4}
          >
            {imageUrl && (
              <Box position="relative" w="60px" h="60px" flexShrink={0} borderRadius="md" overflow="hidden">
                <NextImage src={imageUrl} alt={item.attributes.name} fill style={{ objectFit: "cover" }} sizes="60px" />
              </Box>
            )}
            <Box flex={1}>
              <Text fontWeight="semibold">{item.attributes.name}</Text>
              {item.attributes.external_url && (
                <Flex as="a" href={item.attributes.external_url} target="_blank" align="center" gap={1} color="green.400" fontSize="sm" mt={1}>
                  <Icon as={RiExternalLinkLine} />
                  <Text textDecoration="underline">Link</Text>
                </Flex>
              )}
            </Box>
            <Flex gap={2}>
              <Button size="sm" variant="ghost" onClick={() => onEdit(item)}>
                <Icon as={RiEditLine} />
              </Button>
              <Button size="sm" variant="ghost" colorScheme="red" onClick={() => onDelete(item)}>
                <Icon as={RiDeleteBinLine} />
              </Button>
            </Flex>
          </Flex>
        );
      })}
    </VStack>
  );
}
```

---

## Task 5: Create Barrel Export

**Files:**

- Create: `src/features/lists/index.ts`

- [ ] **Step 1: Write barrel export**

```typescript
// Components
export { ListCard } from "./components/ListCard";
export { ListDetail } from "./components/ListDetail";
export { CreateListModal } from "./components/CreateListModal";
export { ListForm } from "./components/ListForm";
export { ListItemForm } from "./components/ListItemForm";
export { ListItemList } from "./components/ListItemList";
// Hooks
export { useLists } from "./hooks/useLists";
export { useList } from "./hooks/useList";
export { useListsByUser } from "./hooks/useListsByUser";
export { useCreateList } from "./hooks/useCreateList";
export { useUpdateList } from "./hooks/useUpdateList";
export { useDeleteList } from "./hooks/useDeleteList";
export { useCreateListItem } from "./hooks/useCreateListItem";
export { useUpdateListItem } from "./hooks/useUpdateListItem";
export { useDeleteListItem } from "./hooks/useDeleteListItem";
// Services
export { getLists } from "./services/getLists";
export { getListById } from "./services/getListById";
export { getListsByUser } from "./services/getListsByUser";
export { createList } from "./services/createList";
export { updateList } from "./services/updateList";
export { deleteList } from "./services/deleteList";
export { createListItem } from "./services/createListItem";
export { updateListItem } from "./services/updateListItem";
export { deleteListItem } from "./services/deleteListItem";
// Types
export type * from "./types/lists";
```

---

## Task 6: Add navigation link in SidebarNav

**Files:**

- Modify: `src/shared/ui/Layout/Sidebar/SidebarNav.tsx`

- [ ] **Step 1: Add RiListCheck2 icon import**

Add to the existing import line:

```typescript
import {
  RiContactsLine,
  RiDashboardLine,
  RiPencilRulerFill,
  RiPinDistanceLine,
  RiRobot2Line,
  RiListCheck2
} from "react-icons/ri";
```

- [ ] **Step 2: Add Lists navigation link under "Principal" section**

After the `Truta IA` NavLink:

```typescript
          <NavLink
            icon={RiListCheck2}
            href="/lists"
            _activeLink={{
              textDecoration: "none",
              color: "green.400"
            }}
          >
            Listas
          </NavLink>
```

---

## Task 7: Create Public Lists Discovery Page with Type Filters

**Files:**

- Create: `src/app/(public)/lists/page.tsx`
- No middleware changes needed — (public) routes are already public

- [ ] **Step 1: Create public lists discovery page with type filter pills**

```typescript
"use client";

import { useMemo, useState } from "react";
import { Box, Button, Flex, Grid, HStack, Spinner, Tag, TagLabel, Text, useDisclosure } from "@chakra-ui/react";
import { ListCard, CreateListModal, useLists } from "@/features/lists";
import { useAuth } from "@/shared/hooks/useAuth";
import { TitleSection } from "@/shared/ui/TitleSection";
import type { ListType } from "@/features/lists";

const TYPE_FILTERS: Array<{ label: string; value: ListType | "all" }> = [
  { label: "Todas", value: "all" },
  { label: "Desejo", value: "wish" },
  { label: "Curti", value: "like" },
  { label: "Quero", value: "want" },
  { label: "Recomendo", value: "recommend" },
];

export default function ListsPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useLists();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeFilter, setActiveFilter] = useState<ListType | "all">("all");

  const filteredLists = useMemo(() => {
    if (!data?.data) return [];
    if (activeFilter === "all") return data.data;
    return data.data.filter((list) => list.attributes.type === activeFilter);
  }, [data, activeFilter]);

  return (
    <Box position="relative">
      <TitleSection title="Listas" />
      <Box width="100%">
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
          <HStack spacing={2}>
            {TYPE_FILTERS.map((filter) => (
              <Tag
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                cursor="pointer"
                colorScheme={activeFilter === filter.value ? "green" : "gray"}
                variant={activeFilter === filter.value ? "solid" : "outline"}
                borderRadius="full"
                px={3}
                py={1}
              >
                <TagLabel>{filter.label}</TagLabel>
              </Tag>
            ))}
          </HStack>
          {user && (
            <Button colorScheme="green" size="sm" onClick={onOpen}>
              Criar Lista
            </Button>
          )}
        </Flex>

        {isLoading && (
          <Flex justify="center" align="center" minH="300px">
            <Spinner size="lg" color="green.400" />
          </Flex>
        )}

        {isError && (
          <Flex justify="center" align="center" minH="300px">
            <Text color="red.400">Erro ao carregar listas. Tente novamente.</Text>
          </Flex>
        )}

        {!isLoading && !isError && (
          <>
            {filteredLists.length === 0 ? (
              <Text color="gray.400" textAlign="center" mt={12}>
                {activeFilter === "all"
                  ? "Nenhuma lista encontrada. Seja o primeiro a criar!"
                  : "Nenhuma lista com esse filtro."}
              </Text>
            ) : (
              <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                {filteredLists.map((list) => (
                  <ListCard key={list.id} list={list} />
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>

      <CreateListModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
```

---

## Task 8: Create Public List Detail Page

**Files:**

- Create: `src/app/(public)/lists/[id]/page.tsx`

- [ ] **Step 1: Create public list detail page**

```typescript
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

  return <ListDetail list={data.data} onDelete={() => router.push("/lists")} />;
}
```

---

## Task 9: Create Dashboard Lists Management Page

**Files:**

- Create: `src/app/(protected)/dashboard/lists/page.tsx`

- [ ] **Step 1: Create dashboard lists management page**

```typescript
"use client";

import { Box, Button, Flex, Grid, Icon, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { RiDeleteBinLine, RiEditLine } from "react-icons/ri";
import NextLink from "next/link";
import { useAuth } from "@/shared/hooks/useAuth";
import { useColors } from "@/shared/hooks/useColors";
import { TitleSection } from "@/shared/ui/TitleSection";
import { CreateListModal, useDeleteList, useListsByUser } from "@/features/lists";
import { ListCard } from "@/features/lists";

export default function DashboardListsPage() {
  const { user } = useAuth();
  const { textMuted } = useColors();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading } = useListsByUser(user?.id);
  const deleteList = useDeleteList();

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta lista?")) return;
    try {
      await deleteList.mutateAsync(id);
      toast({ title: "Lista excluída", status: "success" });
    } catch {
      toast({ title: "Erro ao excluir lista", status: "error" });
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <TitleSection title="Minhas Listas" size="md" />
        <Button colorScheme="green" size="sm" onClick={onOpen}>
          Criar Lista
        </Button>
      </Flex>

      {data?.data && data.data.length > 0 ? (
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
          {data.data.map((list) => (
            <Box key={list.id} position="relative">
              <ListCard list={list} />
              <Flex position="absolute" top={2} right={2} gap={1}>
                <Button
                  as={NextLink}
                  href={`/dashboard/lists/${list.id}/edit`}
                  size="xs"
                  variant="solid"
                  colorScheme="whiteAlpha"
                >
                  <Icon as={RiEditLine} />
                </Button>
                <Button size="xs" variant="solid" colorScheme="red" onClick={() => handleDelete(list.id)}>
                  <Icon as={RiDeleteBinLine} />
                </Button>
              </Flex>
            </Box>
          ))}
        </Grid>
      ) : (
        <Text color={textMuted} textAlign="center" py={12}>
          Você ainda não criou nenhuma lista.
        </Text>
      )}

      <CreateListModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
```

---

## Task 10: Create Edit List Page

**Files:**

- Create: `src/app/(protected)/dashboard/lists/[id]/edit/page.tsx`

- [ ] **Step 1: Create edit list page**

```typescript
"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Flex, Heading, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useColors } from "@/shared/hooks/useColors";
import { TitleSection } from "@/shared/ui/TitleSection";
import { ListForm, ListItemForm, ListItemList, useList, useUpdateList, useDeleteListItem } from "@/features/lists";
import type { ListItem, ListType } from "@/features/lists";

type EditListPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditListPage(props: EditListPageProps) {
  const params = use(props.params);
  const router = useRouter();
  const toast = useToast();
  const { id } = params;
  const { cardBg } = useColors();
  const { data, isLoading } = useList(id);
  const updateList = useUpdateList(id);
  const deleteListItem = useDeleteListItem(id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState<ListItem | undefined>();

  const handleSaveList = async (formData: { title: string; type: ListType }) => {
    try {
      await updateList.mutateAsync(formData);
      toast({ title: "Lista atualizada!", status: "success" });
    } catch {
      toast({ title: "Erro ao atualizar lista", status: "error" });
    }
  };

  const handleEditItem = (item: ListItem) => {
    setEditingItem(item);
    onOpen();
  };

  const handleDeleteItem = async (item: ListItem) => {
    if (!window.confirm(`Excluir "${item.attributes.name}"?`)) return;
    try {
      await deleteListItem.mutateAsync(item.id);
      toast({ title: "Item excluído", status: "success" });
    } catch {
      toast({ title: "Erro ao excluir item", status: "error" });
    }
  };

  const handleAddNewItem = () => {
    setEditingItem(undefined);
    onOpen();
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="lg" color="green.400" />
      </Flex>
    );
  }

  if (!data?.data) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Text color="red.400">Lista não encontrada.</Text>
      </Flex>
    );
  }

  const list = data.data;
  const items = list.attributes.items?.data ?? [];

  return (
    <Box>
      <TitleSection title="Editar Lista" />

      <Box bg={cardBg} borderRadius="lg" p={6} mb={6}>
        <Heading size="sm" mb={4}>Informações da Lista</Heading>
        <ListForm initialData={list} onSubmit={handleSaveList} isLoading={updateList.isPending} />
      </Box>

      <Box bg={cardBg} borderRadius="lg" p={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="sm">Itens ({items.length})</Heading>
          <Button size="sm" colorScheme="green" onClick={handleAddNewItem}>
            Adicionar Item
          </Button>
        </Flex>

        {items.length > 0 ? (
          <ListItemList items={items} onEdit={handleEditItem} onDelete={handleDeleteItem} />
        ) : (
          <Text color="gray.400" textAlign="center" py={8}>
            Nenhum item ainda. Clique em "Adicionar Item" para começar.
          </Text>
        )}
      </Box>

      <ListItemForm isOpen={isOpen} onClose={onClose} listId={id} listItem={editingItem} />
    </Box>
  );
}
```

---

## Task 11: Update Dashboard "Criar Lista" Card

**Files:**

- Modify: `src/features/dashboard/index.tsx`

- [ ] **Step 1: Change "Criar Lista" href from "/" to "/dashboard/lists"**

In `src/features/dashboard/index.tsx`, find the `Criar Lista` card (around line 77-99) and change:

```typescript
href = "/";
```

to:

```typescript
href = "/dashboard/lists";
```

---

## Task 12: Update User Type with `user_lists` Field

**Files:**

- Modify: `src/features/user/types/User.type.ts`

- [ ] **Step 1: Add user_lists to User type**

```typescript
export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  category: Category;
  about: string;
  website_url: string;
  instagram_url: string;
  avatar: Avatar;
  address: Address;
  user_lists?: Array<{ id: number; title: string; type: string }>;
  updatedAt?: string;
  blocked: boolean;
  confirmed: boolean;
};
```

---

## Task 13: Add Lists Tab to User Profile

**Files:**

- Modify: `src/features/user/components/Profile/index.tsx`

- [ ] **Step 1: Add lists tab section to profile page**

After the "Sobre" section (after line 66) and before the `Flex minH="100vh"`, add:

```typescript
<Box bg={cardBg} borderRadius="lg" p={{ base: 4, md: 8 }} mb={6}>
  <Heading size="md" mb={4}>Listas</Heading>
  {user.user_lists && user.user_lists.length > 0 ? (
    <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
      {user.user_lists.map((list) => (
        <Box as={NextLink} href={`/lists/${list.id}`} key={list.id} bg={cardBg} borderRadius="lg" border="1px solid" borderColor={borderColor} p={4} _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s" }}>
          <Badge colorScheme={TYPE_COLORS[list.type as "wish" | "like" | "want" | "recommend"] || "gray"} px={2} borderRadius="full">
            {TYPE_LABELS[list.type as "wish" | "like" | "want" | "recommend"] || list.type}
          </Badge>
          <Text fontWeight="semibold" mt={2}>{list.title}</Text>
        </Box>
      ))}
    </Grid>
  ) : (
    <Text color={textMuted}>Este skatista ainda não possui listas públicas.</Text>
  )}
</Box>
```

Also need to add imports at the top:

```typescript
import NextLink from "next/link";
import { Badge, Grid } from "@chakra-ui/react";
```

And add the TYPE_LABELS and TYPE_COLORS before the component:

```typescript
const TYPE_LABELS: Record<string, string> = {
  wish: "Desejo",
  like: "Curti",
  want: "Quero",
  recommend: "Recomendo"
};

const TYPE_COLORS: Record<string, string> = {
  wish: "purple",
  like: "green",
  want: "orange",
  recommend: "blue"
};
```

---

## Task 14: Update Documentation

**Files:**

- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `specs/lists.md` (correct inaccuracies)

- [ ] **Step 1: Update README.md**

Add a bullet under a "Listas" category in the Features section:

```markdown
- **Listas** — Crie e compartilhe coleções temáticas (desejo, curtidas, quero, recomendo) de itens relacionados ao skate.
```

- [ ] **Step 2: Update CHANGELOG.md**

Add at the top of `## [Unreleased]`:

```markdown
- 2026-07-10 - Add lists feature with public discovery, detail view, dashboard management, and profile integration
```

- [ ] **Step 3: Update specs/lists.md with corrections**

Fix the inaccuracies found during implementation:

- `created_by_user` → `owner`
- `/api/lists` → `/api/user-lists`
- `/api/list-items` → `/api/user-list-items`
- Remove middleware.ts reference (protection is via layout)
- `User.lists` → `User.user_lists`

---

## Task 15: Verify Build

- [ ] **Step 1: Run TypeScript check**

```bash
pnpm typecheck
```

Expected: No type errors.

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: No lint errors.

- [ ] **Step 3: Run build**

```bash
pnpm build
```

Expected: Successful build with no errors.

---

## Spec Coverage Checklist

- [ ] `/lists` page displays all public lists with name, type badge, item count, creator info (Task 7)
- [ ] Type filter pills on `/lists` filter by list type (wish/like/want/recommend/all) (Task 7)
- [ ] `/lists/[id]` shows full list details with items in fixed order (Task 8)
- [ ] Creator name/avatar links to profile (Task 4 — ListDetail component)
- [ ] Edit/Delete buttons visible only to list owner (Task 4 — ListDetail component)
- [ ] `/dashboard/lists` is protected — redirects unauthenticated (uses (protected) layout)
- [ ] `/dashboard/lists` shows user's lists with edit/delete buttons (Task 9)
- [ ] "Criar lista" button opens modal (Task 9 — CreateListModal)
- [ ] Create list validates title and type (Task 4 — CreateListModal)
- [ ] On create, redirects to edit page to add items (Task 4 — CreateListModal)
- [ ] Edit page pre-populated with current values (Task 10 — ListForm)
- [ ] "Add Item" button opens modal with validation (Task 10)
- [ ] Item images can be uploaded via multipart form-data (Task 4 — ListItemForm + Task 2 createListItem)
- [ ] Items display with edit/delete buttons (Task 4 — ListItemList)
- [ ] Delete list with confirmation modal (Task 4 — ListDetail, Task 9)
- [ ] User profile has "Listas" section showing user's lists (Task 13)
- [ ] All services use `apiClient` (Task 2)
- [ ] No `console.log` in any new file — all files follow this rule
- [ ] TanStack Query cache invalidation after mutations (Task 3)
- [ ] Sidebar has "Listas" navigation link (Task 6)
- [ ] Dashboard "Criar Lista" card navigates to `/dashboard/lists` (Task 11)
- [ ] User type updated with `user_lists` field (Task 12)
