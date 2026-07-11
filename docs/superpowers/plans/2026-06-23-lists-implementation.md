# Lista (Collections) Implementation Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a complete user-curated collections (Lists) feature allowing users to create, organize, share, and discover typed item collections with a public browse page, user dashboard, and profile integration.

**Architecture:** 
- **Phase 1:** Core types, services, and hooks (no UI yet)
- **Phase 2:** User dashboard for list management (CRUD operations)
- **Phase 3:** Public discovery and detail pages
- **Phase 4:** User profile integration

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, TanStack Query, Chakra UI, Strapi backend

---

## File Structure Overview

```
src/features/lists/
├── components/
│   ├── ListCard/index.tsx              # Card for discover & profile
│   ├── ListDetail/index.tsx            # Full list view with items
│   ├── ListForm/index.tsx              # Create/edit form
│   ├── ListItemCard/index.tsx          # Individual item card
│   ├── ListItemForm/index.tsx          # Add/edit item modal
│   └── ListTypeFilter/index.tsx        # Type filter controls
├── hooks/
│   ├── useLists.ts                     # Query all lists
│   ├── useListsByUserId.ts             # Query user's lists
│   ├── useList.ts                      # Query single list
│   ├── useCreateList.ts                # Create mutation
│   ├── useUpdateList.ts                # Update mutation
│   ├── useDeleteList.ts                # Delete mutation
│   ├── useCreateListItem.ts            # Create item mutation
│   ├── useUpdateListItem.ts            # Update item mutation
│   ├── useDeleteListItem.ts            # Delete item mutation
│   └── index.ts                        # Barrel export
├── services/
│   ├── getLists.ts                     # GET /api/lists
│   ├── getListById.ts                  # GET /api/lists/:id
│   ├── getListsByUserId.ts             # GET filtered by user
│   ├── createList.ts                   # POST /api/lists
│   ├── updateList.ts                   # PUT /api/lists/:id
│   ├── deleteList.ts                   # DELETE /api/lists/:id
│   ├── createListItem.ts               # POST /api/list-items
│   ├── updateListItem.ts               # PUT /api/list-items/:id
│   ├── deleteListItem.ts               # DELETE /api/list-items/:id
│   └── index.ts                        # Barrel export
├── types/
│   ├── lists.ts                        # All TypeScript types
│   └── index.ts                        # Barrel export
└── index.ts                            # Feature barrel export

src/app/
├── (public)/lists/
│   ├── page.tsx                        # Discover page
│   └── [id]/page.tsx                   # Detail page
└── (protected)/dashboard/lists/
    ├── page.tsx                        # User's lists
    ├── new/page.tsx                    # Create form
    └── [id]/page.tsx                   # Edit form & manage items

Modifications:
- src/middleware.ts                     # Add protected routes
- src/features/user/types/User.type.ts  # Add lists relation
- src/features/user/components/Profile/index.tsx  # Add Lists tab
- src/app/(protected)/dashboard/layout.tsx  # Add nav link
- README.md                             # Document feature
- CHANGELOG.md                          # Entry
```

---

## PHASE 1: Core Infrastructure (Types, Services, Hooks)

### Task 1: TypeScript Types for Lists

**Files:**
- Create: `src/features/lists/types/lists.ts`
- Create: `src/features/lists/types/index.ts`

**Steps:**

- [ ] **1.1: Write types file with List and ListItem definitions**

Create `src/features/lists/types/lists.ts`:

```typescript
// List Type
export interface ListAttributes {
  title: string;
  type: 'wish' | 'like' | 'want' | 'recommend';
  createdAt: string;
  updatedAt: string;
  owner: {
    data: {
      id: number;
      attributes: {
        username: string;
        name: string;
        avatar?: {
          data?: {
            attributes: {
              url: string;
              formats?: {
                thumbnail?: {
                  url: string;
                };
              };
            };
          };
        };
      };
    };
  };
  items: {
    data: ListItemAttributes[];
  };
}

export interface List {
  id: number;
  attributes: ListAttributes;
}

export interface ListsResponse {
  data: List[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ListResponse {
  data: List;
}

// ListItem Type
export interface ListItemAttributes {
  name: string;
  description?: string;
  external_url?: string;
  image?: {
    data?: {
      attributes: {
        url: string;
        formats?: {
          thumbnail?: {
            url: string;
          };
        };
      };
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface ListItem {
  id: number;
  attributes: ListItemAttributes;
}

export interface ListItemsResponse {
  data: ListItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ListItemResponse {
  data: ListItem;
}

// Request/Mutation Types
export interface CreateListInput {
  title: string;
  type: 'wish' | 'like' | 'want' | 'recommend';
}

export interface UpdateListInput {
  title?: string;
  type?: 'wish' | 'like' | 'want' | 'recommend';
}

export interface CreateListItemInput {
  name: string;
  description?: string;
  external_url?: string;
  image?: File;
}

export interface UpdateListItemInput {
  name?: string;
  description?: string;
  external_url?: string;
  image?: File;
}
```

- [ ] **1.2: Create barrel export for types**

Create `src/features/lists/types/index.ts`:

```typescript
export type {
  ListAttributes,
  List,
  ListsResponse,
  ListResponse,
  ListItemAttributes,
  ListItem,
  ListItemsResponse,
  ListItemResponse,
  CreateListInput,
  UpdateListInput,
  CreateListItemInput,
  UpdateListItemInput,
} from './lists';
```

- [ ] **1.3: Verify types by running TypeScript check**

```bash
pnpm tsc --noEmit
```

Expected: No TypeScript errors

- [ ] **1.4: Commit**

```bash
git add src/features/lists/types/
git commit -m "feat(lists): add TypeScript types for List and ListItem"
```

---

### Task 2: Service Functions for Lists

**Files:**
- Create: `src/features/lists/services/getLists.ts`
- Create: `src/features/lists/services/getListById.ts`
- Create: `src/features/lists/services/getListsByUserId.ts`
- Create: `src/features/lists/services/createList.ts`
- Create: `src/features/lists/services/updateList.ts`
- Create: `src/features/lists/services/deleteList.ts`
- Create: `src/features/lists/services/index.ts`

**Steps:**

- [ ] **2.1: Create getLists service**

Create `src/features/lists/services/getLists.ts`:

```typescript
import { apiClient } from '@/shared/lib/apiClient';
import type { ListsResponse } from '../types';

interface GetListsParams {
  type?: 'wish' | 'like' | 'want' | 'recommend';
  page?: number;
  pageSize?: number;
}

export async function getLists(params?: GetListsParams): Promise<ListsResponse> {
  const query = new URLSearchParams();
  
  // Populate query
  query.append('populate[owner][fields][0]', 'username');
  query.append('populate[owner][fields][1]', 'name');
  query.append('populate[owner][populate][avatar][fields][0]', 'url');
  query.append('populate[owner][populate][avatar][fields][1]', 'formats');
  query.append('populate[items]', 'true');
  
  // Pagination
  query.append('pagination[pageSize]', String(params?.pageSize ?? 12));
  query.append('pagination[page]', String(params?.page ?? 1));
  
  // Filter by type
  if (params?.type) {
    query.append('filters[type][$eq]', params.type);
  }
  
  const { data } = await apiClient.get<ListsResponse>(`/api/lists?${query.toString()}`);
  return data;
}
```

- [ ] **2.2: Create getListById service**

Create `src/features/lists/services/getListById.ts`:

```typescript
import { apiClient } from '@/shared/lib/apiClient';
import type { ListResponse } from '../types';

export async function getListById(id: number): Promise<ListResponse> {
  const query = new URLSearchParams();
  
  query.append('populate[owner][fields][0]', 'username');
  query.append('populate[owner][fields][1]', 'name');
  query.append('populate[owner][populate][avatar][fields][0]', 'url');
  query.append('populate[owner][populate][avatar][fields][1]', 'formats');
  query.append('populate[items][populate][image][fields][0]', 'url');
  query.append('populate[items][populate][image][fields][1]', 'formats');
  
  const { data } = await apiClient.get<ListResponse>(`/api/lists/${id}?${query.toString()}`);
  return data;
}
```

- [ ] **2.3: Create getListsByUserId service**

Create `src/features/lists/services/getListsByUserId.ts`:

```typescript
import { apiClient } from '@/shared/lib/apiClient';
import type { ListsResponse } from '../types';

export async function getListsByUserId(userId: number): Promise<ListsResponse> {
  const query = new URLSearchParams();
  
  query.append('populate[owner][fields][0]', 'username');
  query.append('populate[owner][fields][1]', 'name');
  query.append('populate[owner][populate][avatar][fields][0]', 'url');
  query.append('populate[owner][populate][avatar][fields][1]', 'formats');
  query.append('populate[items]', 'true');
  query.append('filters[owner][id][$eq]', String(userId));
  query.append('pagination[pageSize]', '50');
  
  const { data } = await apiClient.get<ListsResponse>(`/api/lists?${query.toString()}`);
  return data;
}
```

- [ ] **2.4: Create createList service**

Create `src/features/lists/services/createList.ts`:

```typescript
import { apiClient } from '@/shared/lib/apiClient';
import type { CreateListInput, ListResponse } from '../types';

export async function createList(input: CreateListInput): Promise<ListResponse> {
  const { data } = await apiClient.post<ListResponse>('/api/lists', {
    data: input,
  });
  return data;
}
```

- [ ] **2.5: Create updateList service**

Create `src/features/lists/services/updateList.ts`:

```typescript
import { apiClient } from '@/shared/lib/apiClient';
import type { UpdateListInput, ListResponse } from '../types';

export async function updateList(
  id: number,
  input: UpdateListInput
): Promise<ListResponse> {
  const { data } = await apiClient.put<ListResponse>(`/api/lists/${id}`, {
    data: input,
  });
  return data;
}
```

- [ ] **2.6: Create deleteList service**

Create `src/features/lists/services/deleteList.ts`:

```typescript
import { apiClient } from '@/shared/lib/apiClient';

export async function deleteList(id: number): Promise<void> {
  await apiClient.delete(`/api/lists/${id}`);
}
```

- [ ] **2.7: Create services barrel export**

Create `src/features/lists/services/index.ts`:

```typescript
export { getLists } from './getLists';
export { getListById } from './getListById';
export { getListsByUserId } from './getListsByUserId';
export { createList } from './createList';
export { updateList } from './updateList';
export { deleteList } from './deleteList';
export { createListItem } from './createListItem';
export { updateListItem } from './updateListItem';
export { deleteListItem } from './deleteListItem';
```

- [ ] **2.8: Verify no syntax errors**

```bash
pnpm tsc --noEmit src/features/lists/services/
```

Expected: No errors

- [ ] **2.9: Commit**

```bash
git add src/features/lists/services/
git commit -m "feat(lists): add service functions for list operations"
```

---

### Task 3: Service Functions for List Items

**Files:**
- Create: `src/features/lists/services/createListItem.ts`
- Create: `src/features/lists/services/updateListItem.ts`
- Create: `src/features/lists/services/deleteListItem.ts`

**Steps:**

- [ ] **3.1: Create createListItem service**

Create `src/features/lists/services/createListItem.ts`:

```typescript
import { apiClient } from '@/shared/lib/apiClient';
import type { CreateListItemInput, ListItemResponse } from '../types';

interface CreateListItemWithListInput extends CreateListItemInput {
  listId: number;
}

export async function createListItem(
  input: CreateListItemWithListInput
): Promise<ListItemResponse> {
  const formData = new FormData();
  formData.append('data[name]', input.name);
  if (input.description) formData.append('data[description]', input.description);
  if (input.external_url) formData.append('data[external_url]', input.external_url);
  formData.append('data[list]', String(input.listId));
  if (input.image) formData.append('files.image', input.image);

  const { data } = await apiClient.post<ListItemResponse>(
    '/api/list-items',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
}
```

- [ ] **3.2: Create updateListItem service**

Create `src/features/lists/services/updateListItem.ts`:

```typescript
import { apiClient } from '@/shared/lib/apiClient';
import type { UpdateListItemInput, ListItemResponse } from '../types';

export async function updateListItem(
  id: number,
  input: UpdateListItemInput
): Promise<ListItemResponse> {
  const formData = new FormData();
  if (input.name) formData.append('data[name]', input.name);
  if (input.description) formData.append('data[description]', input.description);
  if (input.external_url) formData.append('data[external_url]', input.external_url);
  if (input.image) formData.append('files.image', input.image);

  const { data } = await apiClient.put<ListItemResponse>(
    `/api/list-items/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
}
```

- [ ] **3.3: Create deleteListItem service**

Create `src/features/lists/services/deleteListItem.ts`:

```typescript
import { apiClient } from '@/shared/lib/apiClient';

export async function deleteListItem(id: number): Promise<void> {
  await apiClient.delete(`/api/list-items/${id}`);
}
```

- [ ] **3.4: Verify no syntax errors**

```bash
pnpm tsc --noEmit src/features/lists/services/createListItem.ts src/features/lists/services/updateListItem.ts src/features/lists/services/deleteListItem.ts
```

Expected: No errors

- [ ] **3.5: Commit**

```bash
git add src/features/lists/services/createListItem.ts src/features/lists/services/updateListItem.ts src/features/lists/services/deleteListItem.ts
git commit -m "feat(lists): add list item service functions"
```

---

### Task 4: TanStack Query Hooks for Lists

**Files:**
- Create: `src/features/lists/hooks/useLists.ts`
- Create: `src/features/lists/hooks/useListsByUserId.ts`
- Create: `src/features/lists/hooks/useList.ts`
- Create: `src/features/lists/hooks/useCreateList.ts`
- Create: `src/features/lists/hooks/useUpdateList.ts`
- Create: `src/features/lists/hooks/useDeleteList.ts`
- Create: `src/features/lists/hooks/index.ts`

**Steps:**

- [ ] **4.1: Create useLists hook (read)**

Create `src/features/lists/hooks/useLists.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { getLists } from '../services';
import type { ListsResponse } from '../types';

interface UseListsParams {
  type?: 'wish' | 'like' | 'want' | 'recommend';
  page?: number;
  pageSize?: number;
}

export function useLists(params?: UseListsParams) {
  return useQuery<ListsResponse, Error>({
    queryKey: ['lists', params?.type, params?.page, params?.pageSize],
    queryFn: () => getLists(params),
  });
}
```

- [ ] **4.2: Create useListsByUserId hook (read)**

Create `src/features/lists/hooks/useListsByUserId.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { getListsByUserId } from '../services';
import type { ListsResponse } from '../types';

export function useListsByUserId(userId: number) {
  return useQuery<ListsResponse, Error>({
    queryKey: ['lists', 'user', userId],
    queryFn: () => getListsByUserId(userId),
  });
}
```

- [ ] **4.3: Create useList hook (read single)**

Create `src/features/lists/hooks/useList.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { getListById } from '../services';
import type { ListResponse } from '../types';

export function useList(id: number) {
  return useQuery<ListResponse, Error>({
    queryKey: ['lists', id],
    queryFn: () => getListById(id),
  });
}
```

- [ ] **4.4: Create useCreateList hook (mutation)**

Create `src/features/lists/hooks/useCreateList.ts`:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createList } from '../services';
import type { CreateListInput, ListResponse } from '../types';

export function useCreateList() {
  const queryClient = useQueryClient();

  return useMutation<ListResponse, Error, CreateListInput>({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
}
```

- [ ] **4.5: Create useUpdateList hook (mutation)**

Create `src/features/lists/hooks/useUpdateList.ts`:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateList } from '../services';
import type { UpdateListInput, ListResponse } from '../types';

interface UpdateListParams {
  id: number;
  input: UpdateListInput;
}

export function useUpdateList() {
  const queryClient = useQueryClient();

  return useMutation<ListResponse, Error, UpdateListParams>({
    mutationFn: ({ id, input }) => updateList(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      queryClient.invalidateQueries({ queryKey: ['lists', data.data.id] });
    },
  });
}
```

- [ ] **4.6: Create useDeleteList hook (mutation)**

Create `src/features/lists/hooks/useDeleteList.ts`:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteList } from '../services';

export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
}
```

- [ ] **4.7: Create hooks barrel export**

Create `src/features/lists/hooks/index.ts`:

```typescript
export { useLists } from './useLists';
export { useListsByUserId } from './useListsByUserId';
export { useList } from './useList';
export { useCreateList } from './useCreateList';
export { useUpdateList } from './useUpdateList';
export { useDeleteList } from './useDeleteList';
export { useCreateListItem } from './useCreateListItem';
export { useUpdateListItem } from './useUpdateListItem';
export { useDeleteListItem } from './useDeleteListItem';
```

- [ ] **4.8: Verify no syntax errors**

```bash
pnpm tsc --noEmit src/features/lists/hooks/
```

Expected: No errors

- [ ] **4.9: Commit**

```bash
git add src/features/lists/hooks/
git commit -m "feat(lists): add TanStack Query hooks for lists"
```

---

### Task 5: TanStack Query Hooks for List Items

**Files:**
- Create: `src/features/lists/hooks/useCreateListItem.ts`
- Create: `src/features/lists/hooks/useUpdateListItem.ts`
- Create: `src/features/lists/hooks/useDeleteListItem.ts`

**Steps:**

- [ ] **5.1: Create useCreateListItem hook**

Create `src/features/lists/hooks/useCreateListItem.ts`:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createListItem } from '../services';
import type { CreateListItemInput, ListItemResponse } from '../types';

interface CreateListItemWithListInput extends CreateListItemInput {
  listId: number;
}

export function useCreateListItem() {
  const queryClient = useQueryClient();

  return useMutation<ListItemResponse, Error, CreateListItemWithListInput>({
    mutationFn: createListItem,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lists', variables.listId] });
    },
  });
}
```

- [ ] **5.2: Create useUpdateListItem hook**

Create `src/features/lists/hooks/useUpdateListItem.ts`:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateListItem } from '../services';
import type { UpdateListItemInput, ListItemResponse } from '../types';

interface UpdateListItemParams {
  id: number;
  listId: number;
  input: UpdateListItemInput;
}

export function useUpdateListItem() {
  const queryClient = useQueryClient();

  return useMutation<ListItemResponse, Error, UpdateListItemParams>({
    mutationFn: ({ id, input }) => updateListItem(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lists', variables.listId] });
    },
  });
}
```

- [ ] **5.3: Create useDeleteListItem hook**

Create `src/features/lists/hooks/useDeleteListItem.ts`:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteListItem } from '../services';

interface DeleteListItemParams {
  id: number;
  listId: number;
}

export function useDeleteListItem() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteListItemParams>({
    mutationFn: ({ id }) => deleteListItem(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lists', variables.listId] });
    },
  });
}
```

- [ ] **5.4: Verify no syntax errors**

```bash
pnpm tsc --noEmit src/features/lists/hooks/useCreateListItem.ts src/features/lists/hooks/useUpdateListItem.ts src/features/lists/hooks/useDeleteListItem.ts
```

Expected: No errors

- [ ] **5.5: Verify build completes**

```bash
pnpm build
```

Expected: Build succeeds with no errors

- [ ] **5.6: Commit**

```bash
git add src/features/lists/hooks/useCreateListItem.ts src/features/lists/hooks/useUpdateListItem.ts src/features/lists/hooks/useDeleteListItem.ts
git commit -m "feat(lists): add list item hooks"
```

---

### Task 6: Feature Barrel Export

**Files:**
- Create: `src/features/lists/index.ts`

**Steps:**

- [ ] **6.1: Create barrel export**

Create `src/features/lists/index.ts`:

```typescript
// Services
export { getLists, getListById, getListsByUserId, createList, updateList, deleteList, createListItem, updateListItem, deleteListItem } from './services';

// Hooks
export { useLists, useListsByUserId, useList, useCreateList, useUpdateList, useDeleteList, useCreateListItem, useUpdateListItem, useDeleteListItem } from './hooks';

// Types
export type { List, ListAttributes, ListItem, ListItemAttributes, ListsResponse, ListResponse, ListItemsResponse, ListItemResponse, CreateListInput, UpdateListInput, CreateListItemInput, UpdateListItemInput } from './types';
```

- [ ] **6.2: Test barrel import**

```bash
pnpm tsc --noEmit src/features/lists/index.ts
```

Expected: No errors

- [ ] **6.3: Commit**

```bash
git add src/features/lists/index.ts
git commit -m "feat(lists): add barrel export"
```

**Phase 1 Complete!** All hooks, services, and types are ready for use.

---

## PHASE 2: User Dashboard (My Lists)

### Task 7: Create Basic UI Components

**Files:**
- Create: `src/features/lists/components/ListForm/index.tsx`
- Create: `src/features/lists/components/ListItemForm/index.tsx`
- Create: `src/features/lists/components/ListCard/index.tsx`
- Create: `src/features/lists/components/ListItemCard/index.tsx`

**Steps:**

- [ ] **7.1: Create ListForm component**

Create `src/features/lists/components/ListForm/index.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Stack, useToast } from '@chakra-ui/react';
import { useCreateList, useUpdateList } from '../../hooks';
import type { List, CreateListInput, UpdateListInput } from '../../types';

interface ListFormProps {
  list?: List;
  onSuccess?: (list: List) => void;
  onCancel?: () => void;
}

export function ListForm({ list, onSuccess, onCancel }: ListFormProps) {
  const toast = useToast();
  const [title, setTitle] = useState(list?.attributes.title ?? '');
  const [type, setType] = useState<'wish' | 'like' | 'want' | 'recommend'>(
    list?.attributes.type ?? 'wish'
  );

  const createMutation = useCreateList();
  const updateMutation = useUpdateList();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a list title',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (list) {
        const updateInput: UpdateListInput = {
          title: title.trim(),
          type,
        };
        await updateMutation.mutateAsync({
          id: list.id,
          input: updateInput,
        });
        toast({
          title: 'List updated',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        const createInput: CreateListInput = {
          title: title.trim(),
          type,
        };
        const response = await createMutation.mutateAsync(createInput);
        toast({
          title: 'List created',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        onSuccess?.(response.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save list',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            placeholder="My awesome list"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Type</FormLabel>
          <Select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="wish">Wish</option>
            <option value="like">Like</option>
            <option value="want">Want</option>
            <option value="recommend">Recommend</option>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2} pt={4}>
          <Button type="submit" colorScheme="green" isLoading={isLoading}>
            {list ? 'Update List' : 'Create List'}
          </Button>
          {onCancel && (
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
```

- [ ] **7.2: Create ListItemForm component**

Create `src/features/lists/components/ListItemForm/index.tsx`:

```typescript
'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useCreateListItem, useUpdateListItem } from '../../hooks';
import type { ListItem, CreateListItemInput, UpdateListItemInput } from '../../types';

interface ListItemFormProps {
  listId: number;
  item?: ListItem;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ListItemForm({ listId, item, onSuccess, onCancel }: ListItemFormProps) {
  const toast = useToast();
  const [name, setName] = useState(item?.attributes.name ?? '');
  const [description, setDescription] = useState(item?.attributes.description ?? '');
  const [externalUrl, setExternalUrl] = useState(item?.attributes.external_url ?? '');
  const [image, setImage] = useState<File | null>(null);

  const createMutation = useCreateListItem();
  const updateMutation = useUpdateListItem();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter an item name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (item) {
        const updateInput: UpdateListItemInput = {
          name: name.trim(),
          description: description.trim() || undefined,
          external_url: externalUrl.trim() || undefined,
          image,
        };
        await updateMutation.mutateAsync({
          id: item.id,
          listId,
          input: updateInput,
        });
        toast({
          title: 'Item updated',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        const createInput: CreateListItemInput = {
          name: name.trim(),
          description: description.trim() || undefined,
          external_url: externalUrl.trim() || undefined,
          image,
        };
        await createMutation.mutateAsync({ ...createInput, listId });
        toast({
          title: 'Item added',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        setName('');
        setDescription('');
        setExternalUrl('');
        setImage(null);
      }
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save item',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Item name</FormLabel>
          <Input
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={200}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
        </FormControl>

        <FormControl>
          <FormLabel>External URL</FormLabel>
          <Input
            placeholder="https://example.com"
            type="url"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Image</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
        </FormControl>

        <Stack direction="row" spacing={2} pt={4}>
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            {item ? 'Update Item' : 'Add Item'}
          </Button>
          {onCancel && (
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
```

- [ ] **7.3: Create ListCard component**

Create `src/features/lists/components/ListCard/index.tsx`:

```typescript
'use client';

import { Box, Heading, HStack, Tag, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import type { List } from '../../types';

const TYPE_COLORS: Record<string, string> = {
  wish: 'blue',
  like: 'green',
  want: 'orange',
  recommend: 'purple',
};

interface ListCardProps {
  list: List;
}

export function ListCard({ list }: ListCardProps) {
  const itemCount = list.attributes.items.data.length;
  const ownerName = list.attributes.owner.data.attributes.name || list.attributes.owner.data.attributes.username;
  const typeColor = TYPE_COLORS[list.attributes.type] || 'gray';

  return (
    <Link href={`/lists/${list.id}`}>
      <Box
        p={4}
        borderWidth={1}
        borderRadius="md"
        cursor="pointer"
        _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
        transition="all 0.2s"
      >
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="full">
            <Heading size="sm">{list.attributes.title}</Heading>
            <Tag colorScheme={typeColor}>{list.attributes.type}</Tag>
          </HStack>

          <Text fontSize="sm" color="gray.600">
            By {ownerName}
          </Text>

          <Text fontSize="xs" color="gray.500">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </Text>
        </VStack>
      </Box>
    </Link>
  );
}
```

- [ ] **7.4: Create ListItemCard component**

Create `src/features/lists/components/ListItemCard/index.tsx`:

```typescript
'use client';

import { Box, Button, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import type { ListItem } from '../../types';

interface ListItemCardProps {
  item: ListItem;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ListItemCard({ item, onEdit, onDelete }: ListItemCardProps) {
  const imageUrl = item.attributes.image?.data?.attributes?.formats?.thumbnail?.url ||
    item.attributes.image?.data?.attributes?.url;

  return (
    <Box borderWidth={1} borderRadius="md" p={3} w="full">
      <HStack spacing={3} align="start">
        {imageUrl && (
          <Box position="relative" w={16} h={16} flexShrink={0}>
            <Image
              src={imageUrl}
              alt={item.attributes.name}
              fill
              className="object-cover rounded"
            />
          </Box>
        )}

        <VStack align="start" spacing={2} flex={1}>
          <Text fontWeight="bold">{item.attributes.name}</Text>
          {item.attributes.description && (
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {item.attributes.description}
            </Text>
          )}
          {item.attributes.external_url && (
            <Text
              as="a"
              href={item.attributes.external_url}
              target="_blank"
              rel="noopener noreferrer"
              fontSize="sm"
              color="blue.500"
              _hover={{ textDecoration: 'underline' }}
            >
              View product →
            </Text>
          )}
        </VStack>

        <HStack>
          {onEdit && (
            <Button size="sm" leftIcon={<EditIcon />} onClick={onEdit} colorScheme="blue" variant="ghost">
              Edit
            </Button>
          )}
          {onDelete && (
            <Button size="sm" leftIcon={<DeleteIcon />} onClick={onDelete} colorScheme="red" variant="ghost">
              Delete
            </Button>
          )}
        </HStack>
      </HStack>
    </Box>
  );
}
```

- [ ] **7.5: Verify components build**

```bash
pnpm tsc --noEmit src/features/lists/components/
```

Expected: No errors

- [ ] **7.6: Commit**

```bash
git add src/features/lists/components/
git commit -m "feat(lists): add basic UI components"
```

---

### Task 8: Middleware & Route Protection

**Files:**
- Modify: `src/middleware.ts`

**Steps:**

- [ ] **8.1: Read current middleware**

```bash
cat src/middleware.ts
```

- [ ] **8.2: Add protected route matcher**

Modify `src/middleware.ts` to add `/dashboard/lists` to the protected routes. Find the route matcher and add:

```typescript
// Around the protected routes pattern, add:
'/(protected)/dashboard/lists/:path*': true,
```

The exact location depends on your current middleware structure. Common patterns:
- If using `matcher` array: add `/dashboard/lists/:path*` 
- If using route checking function: add `/dashboard/lists` to protected paths

- [ ] **8.3: Verify middleware compiles**

```bash
pnpm tsc --noEmit src/middleware.ts
```

Expected: No errors

- [ ] **8.4: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(lists): add /dashboard/lists to protected routes"
```

---

### Task 9: Dashboard Pages

**Files:**
- Create: `src/app/(protected)/dashboard/lists/page.tsx`
- Create: `src/app/(protected)/dashboard/lists/new/page.tsx`
- Create: `src/app/(protected)/dashboard/lists/[id]/page.tsx`

**Steps:**

- [ ] **9.1: Create My Lists page**

Create `src/app/(protected)/dashboard/lists/page.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Heading, HStack, Spinner, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useListsByUserId, useDeleteList } from '@/features/lists';

export default function MyListsPage() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  
  const { data: listsResponse, isLoading } = useListsByUserId(user?.id ?? 0);
  const deleteListMutation = useDeleteList();

  if (!user) {
    return (
      <Box p={8} textAlign="center">
        <Text>Please log in to view your lists.</Text>
      </Box>
    );
  }

  const lists = listsResponse?.data ?? [];

  const handleDelete = async (listId: number) => {
    if (!confirm('Are you sure you want to delete this list?')) return;

    try {
      await deleteListMutation.mutateAsync(listId);
      toast({
        title: 'List deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete list',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8}>
      <HStack justify="space-between" mb={8}>
        <Heading>My Lists</Heading>
        <Button colorScheme="green" onClick={() => router.push('/dashboard/lists/new')}>
          Create List
        </Button>
      </HStack>

      {isLoading ? (
        <Spinner />
      ) : lists.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">You haven't created any lists yet.</Text>
          <Button colorScheme="green" mt={4} onClick={() => router.push('/dashboard/lists/new')}>
            Create your first list
          </Button>
        </Box>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Type</Th>
              <Th>Items</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {lists.map((list) => (
              <Tr key={list.id}>
                <Td>{list.attributes.title}</Td>
                <Td>{list.attributes.type}</Td>
                <Td>{list.attributes.items.data.length}</Td>
                <Td>{new Date(list.attributes.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/dashboard/lists/${list.id}`)}
                      colorScheme="blue"
                      variant="ghost"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(list.id)}
                      colorScheme="red"
                      variant="ghost"
                      isLoading={deleteListMutation.isPending}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
```

- [ ] **9.2: Create new list page**

Create `src/app/(protected)/dashboard/lists/new/page.tsx`:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { Box, Heading } from '@chakra-ui/react';
import { ListForm } from '@/features/lists/components/ListForm';
import type { List } from '@/features/lists';

export default function NewListPage() {
  const router = useRouter();

  const handleSuccess = (list: List) => {
    router.push(`/dashboard/lists/${list.id}`);
  };

  const handleCancel = () => {
    router.push('/dashboard/lists');
  };

  return (
    <Box p={8} maxW="md" mx="auto">
      <Heading mb={6}>Create New List</Heading>
      <ListForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </Box>
  );
}
```

- [ ] **9.3: Create edit list page**

Create `src/app/(protected)/dashboard/lists/[id]/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, Button, Heading, HStack, Spinner, Stack, Text, VStack, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useList, useDeleteList } from '@/features/lists';
import { ListForm } from '@/features/lists/components/ListForm';
import { ListItemForm } from '@/features/lists/components/ListItemForm';
import { ListItemCard } from '@/features/lists/components/ListItemCard';
import { useDeleteListItem } from '@/features/lists';

export default function EditListPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const listId = parseInt(params.id as string, 10);

  const { data: listResponse, isLoading } = useList(listId);
  const deleteListMutation = useDeleteList();
  const deleteItemMutation = useDeleteListItem();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  if (isLoading) return <Spinner />;
  if (!listResponse) return <Text>List not found</Text>;

  const list = listResponse.data;
  const items = list.attributes.items.data || [];

  const handleDeleteList = async () => {
    if (!confirm('Delete this list? This action cannot be undone.')) return;

    try {
      await deleteListMutation.mutateAsync(list.id);
      toast({ title: 'List deleted', status: 'success', duration: 2000, isClosable: true });
      router.push('/dashboard/lists');
    } catch (error) {
      toast({ title: 'Error deleting list', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('Delete this item?')) return;

    try {
      await deleteItemMutation.mutateAsync({ id: itemId, listId });
      toast({ title: 'Item deleted', status: 'success', duration: 2000, isClosable: true });
    } catch (error) {
      toast({ title: 'Error deleting item', status: 'error', duration: 3000, isClosable: true });
    }
  };

  return (
    <Box p={8}>
      <VStack align="start" spacing={8} w="full">
        {/* List Info Section */}
        <Box w="full" borderWidth={1} p={6} borderRadius="md">
          <Heading size="md" mb={4}>List Information</Heading>
          <ListForm list={list} onCancel={() => router.push('/dashboard/lists')} />
        </Box>

        {/* Items Section */}
        <Box w="full" borderWidth={1} p={6} borderRadius="md">
          <HStack justify="space-between" mb={4}>
            <Heading size="md">Items ({items.length})</Heading>
            <Button colorScheme="blue" onClick={onOpen}>
              Add Item
            </Button>
          </HStack>

          {items.length === 0 ? (
            <Text color="gray.500">No items yet. Click "Add Item" to get started.</Text>
          ) : (
            <Stack spacing={3}>
              {items.map((item) => (
                <ListItemCard
                  key={item.id}
                  item={item}
                  onEdit={() => setEditingItemId(item.id)}
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Delete List */}
        <Button
          colorScheme="red"
          onClick={handleDeleteList}
          isLoading={deleteListMutation.isPending}
        >
          Delete List
        </Button>
      </VStack>

      {/* Add/Edit Item Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Item</ModalHeader>
          <ModalBody>
            <ListItemForm
              listId={listId}
              item={editingItemId ? items.find((i) => i.id === editingItemId) : undefined}
              onSuccess={onClose}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
```

- [ ] **9.4: Verify pages build**

```bash
pnpm tsc --noEmit src/app/\(protected\)/dashboard/lists/
```

Expected: No errors

- [ ] **9.5: Build and check**

```bash
pnpm build
```

Expected: Build succeeds

- [ ] **9.6: Commit**

```bash
git add src/app/\(protected\)/dashboard/lists/
git commit -m "feat(lists): add dashboard pages for list management"
```

**Phase 2 Complete!** Users can now create, edit, and manage their lists from the dashboard.

---

## PHASE 3: Public Discovery & Sharing

### Task 10: Public List Pages

**Files:**
- Create: `src/app/(public)/lists/page.tsx`
- Create: `src/app/(public)/lists/[id]/page.tsx`
- Create: `src/features/lists/components/ListTypeFilter/index.tsx`
- Create: `src/features/lists/components/ListDetail/index.tsx`

**Steps:**

- [ ] **10.1: Create ListTypeFilter component**

Create `src/features/lists/components/ListTypeFilter/index.tsx`:

```typescript
'use client';

import { HStack, Button, Box } from '@chakra-ui/react';

type ListType = 'wish' | 'like' | 'want' | 'recommend';

interface ListTypeFilterProps {
  selectedType?: ListType;
  onTypeChange: (type?: ListType) => void;
}

const TYPES: { label: string; value: ListType }[] = [
  { label: 'Wish', value: 'wish' },
  { label: 'Like', value: 'like' },
  { label: 'Want', value: 'want' },
  { label: 'Recommend', value: 'recommend' },
];

export function ListTypeFilter({ selectedType, onTypeChange }: ListTypeFilterProps) {
  return (
    <Box>
      <HStack spacing={2} mb={4}>
        <Button
          variant={!selectedType ? 'solid' : 'outline'}
          colorScheme="gray"
          onClick={() => onTypeChange(undefined)}
        >
          All
        </Button>
        {TYPES.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? 'solid' : 'outline'}
            colorScheme={selectedType === type.value ? 'blue' : 'gray'}
            onClick={() => onTypeChange(type.value)}
          >
            {type.label}
          </Button>
        ))}
      </HStack>
    </Box>
  );
}
```

- [ ] **10.2: Create ListDetail component**

Create `src/features/lists/components/ListDetail/index.tsx`:

```typescript
'use client';

import { Box, Button, HStack, Stack, Tag, Text, VStack, useToast } from '@chakra-ui/react';
import Link from 'next/link';
import { useAuth } from '@/shared/hooks/useAuth';
import { ListItemCard } from '../ListItemCard';
import type { List } from '../../types';

const TYPE_COLORS: Record<string, string> = {
  wish: 'blue',
  like: 'green',
  want: 'orange',
  recommend: 'purple',
};

interface ListDetailProps {
  list: List;
}

export function ListDetail({ list }: ListDetailProps) {
  const toast = useToast();
  const { user } = useAuth();
  const isOwner = user?.id === list.attributes.owner.data.id;
  const items = list.attributes.items.data || [];
  const ownerName = list.attributes.owner.data.attributes.name || list.attributes.owner.data.attributes.username;
  const typeColor = TYPE_COLORS[list.attributes.type] || 'gray';

  const handleShare = () => {
    const url = `${window.location.origin}/lists/${list.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'URL copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <VStack align="start" spacing={6} w="full">
      {/* Header */}
      <Box w="full" pb={4} borderBottomWidth={1}>
        <HStack justify="space-between" mb={3}>
          <HStack>
            <Box>
              <Text fontSize="2xl" fontWeight="bold">{list.attributes.title}</Text>
              <Text fontSize="sm" color="gray.600">
                By{' '}
                <Link href={`/user/${list.attributes.owner.data.id}`}>
                  <Text as="span" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                    {ownerName}
                  </Text>
                </Link>
              </Text>
            </Box>
          </HStack>
          <Tag colorScheme={typeColor} fontSize="md" px={3} py={1}>
            {list.attributes.type}
          </Tag>
        </HStack>

        {/* Actions */}
        <HStack spacing={2}>
          <Button onClick={handleShare} colorScheme="gray" variant="outline" size="sm">
            Share
          </Button>
          {isOwner && (
            <Link href={`/dashboard/lists/${list.id}`}>
              <Button colorScheme="blue" variant="outline" size="sm">
                Edit
              </Button>
            </Link>
          )}
        </HStack>
      </Box>

      {/* Items Grid */}
      <Box w="full">
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Items ({items.length})
        </Text>
        {items.length === 0 ? (
          <Text color="gray.500">No items in this list yet.</Text>
        ) : (
          <Stack spacing={3}>
            {items.map((item) => (
              <ListItemCard key={item.id} item={item} />
            ))}
          </Stack>
        )}
      </Box>
    </VStack>
  );
}
```

- [ ] **10.3: Create discover page**

Create `src/app/(public)/lists/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Grid, Heading, Spinner, Text, VStack, useBreakpointValue } from '@chakra-ui/react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useLists } from '@/features/lists';
import { ListCard } from '@/features/lists/components/ListCard';
import { ListTypeFilter } from '@/features/lists/components/ListTypeFilter';

type ListType = 'wish' | 'like' | 'want' | 'recommend';

export default function ListsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<ListType | undefined>();
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3, xl: 4 });

  const { data: listsResponse, isLoading } = useLists({
    type: selectedType,
  });

  const lists = listsResponse?.data ?? [];

  return (
    <VStack align="start" spacing={8} p={8} maxW="7xl" mx="auto" w="full">
      {/* Header */}
      <Box w="full">
        <Heading mb={2}>Lista da comunidade</Heading>
        <Text color="gray.600" mb={4}>
          Discover what other skaters wish, like, want, and recommend
        </Text>

        {user && (
          <Button colorScheme="green" onClick={() => router.push('/dashboard/lists/new')} mb={4}>
            Create List
          </Button>
        )}
      </Box>

      {/* Filter */}
      <ListTypeFilter selectedType={selectedType} onTypeChange={setSelectedType} />

      {/* Lists Grid */}
      {isLoading ? (
        <Spinner />
      ) : lists.length === 0 ? (
        <Text color="gray.500">No lists found.</Text>
      ) : (
        <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={4} w="full">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </Grid>
      )}
    </VStack>
  );
}
```

- [ ] **10.4: Create detail page**

Create `src/app/(public)/lists/[id]/page.tsx`:

```typescript
'use client';

import { useParams } from 'next/navigation';
import { Box, Spinner, Text } from '@chakra-ui/react';
import { useList } from '@/features/lists';
import { ListDetail } from '@/features/lists/components/ListDetail';

export default function ListDetailPage() {
  const params = useParams();
  const listId = parseInt(params.id as string, 10);

  const { data: listResponse, isLoading, error } = useList(listId);

  if (isLoading) return <Spinner />;
  if (error || !listResponse) return <Text>List not found</Text>;

  return (
    <Box p={8} maxW="2xl" mx="auto" w="full">
      <ListDetail list={listResponse.data} />
    </Box>
  );
}
```

- [ ] **10.5: Verify pages build**

```bash
pnpm tsc --noEmit src/app/\(public\)/lists/
```

Expected: No errors

- [ ] **10.6: Build**

```bash
pnpm build
```

Expected: Build succeeds

- [ ] **10.7: Commit**

```bash
git add src/app/\(public\)/lists/ src/features/lists/components/ListTypeFilter/ src/features/lists/components/ListDetail/
git commit -m "feat(lists): add public discover and detail pages"
```

**Phase 3 Complete!** Public discovery and list sharing now work.

---

## PHASE 4: User Profile Integration

### Task 11: Update User Types & Profile

**Files:**
- Modify: `src/features/user/types/User.type.ts`
- Modify: `src/features/user/components/Profile/index.tsx`

**Steps:**

- [ ] **11.1: Update User type to include lists**

Read current User type:

```bash
cat src/features/user/types/User.type.ts | head -50
```

Add `lists` field to the User interface:

```typescript
lists?: List[]; // Add this field
```

Import List type at the top:

```typescript
import type { List } from '@/features/lists';
```

- [ ] **11.2: Update Profile component to show Lists tab**

Read current profile component and add a Lists section. The section should:
- Show lists only if the user has any
- Display lists grid similar to discover page
- Only show lists for the current profile user

Add to Profile component:

```typescript
import { useListsByUserId } from '@/features/lists';
import { ListCard } from '@/features/lists/components/ListCard';

// In component, add state for selected tab
const [selectedTab, setSelectedTab] = useState('overview'); // or whatever current tabs are

// Add Lists tab to tab list
// In tab panels, add:
if (selectedTab === 'lists' || !hasTabsYet) {
  const { data: listsResponse } = useListsByUserId(userId);
  const lists = listsResponse?.data ?? [];
  
  return (
    lists.length > 0 ? (
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
        {lists.map((list) => (
          <ListCard key={list.id} list={list} />
        ))}
      </Grid>
    ) : (
      <Text color="gray.500">No lists yet</Text>
    )
  );
}
```

- [ ] **11.3: Verify types compile**

```bash
pnpm tsc --noEmit src/features/user/types/
```

Expected: No errors

- [ ] **11.4: Commit**

```bash
git add src/features/user/types/User.type.ts src/features/user/components/Profile/index.tsx
git commit -m "feat(lists): integrate lists into user profile"
```

---

### Task 12: Dashboard Navigation

**Files:**
- Modify: `src/app/(protected)/dashboard/layout.tsx` or dashboard navigation component

**Steps:**

- [ ] **12.1: Find dashboard navigation file**

```bash
find src/app/\(protected\)/dashboard -name "layout.tsx" -o -name "*nav*"
```

- [ ] **12.2: Add "My Lists" link**

Add to navigation (same level as Spots):

```typescript
// Import Link from next/link
import Link from 'next/link';

// In nav menu, add:
<Link href="/dashboard/lists">
  <NavItem>Minha Lista</NavItem> {/* Portuguese for "My Lists" */}
</Link>
```

Or if using icon menu:

```typescript
import { RiBookOpenLine } from 'react-icons/ri'; // or your icon choice

// Add to menu items:
{
  label: 'Criar lista',
  href: '/dashboard/lists/new',
  icon: RiBookOpenLine,
}
```

- [ ] **12.3: Verify navigation renders**

```bash
pnpm tsc --noEmit src/app/\(protected\)/dashboard/
```

Expected: No errors

- [ ] **12.4: Commit**

```bash
git add src/app/\(protected\)/dashboard/
git commit -m "feat(lists): add lists to dashboard navigation"
```

---

### Task 13: Documentation

**Files:**
- Modify: `README.md`
- Modify: `CHANGELOG.md`

**Steps:**

- [ ] **13.1: Update README Features section**

Read README:

```bash
cat README.md | head -100
```

Find Features section and add:

```markdown
- **Collections (Lists)** — Create, organize, and share typed collections of items (wish, like, want, recommend); browse and discover lists from the community
```

- [ ] **13.2: Update CHANGELOG**

Add entry at top of Unreleased section:

```markdown
- 2026-06-23 - Add Lists (Collections) feature: users can create and share typed item collections with public discovery and profile integration [#PR](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/XXX) _(vX.Y.Z)_
```

- [ ] **13.3: Verify files**

```bash
head -5 README.md
head -10 CHANGELOG.md
```

- [ ] **13.4: Commit**

```bash
git add README.md CHANGELOG.md
git commit -m "docs: update README and CHANGELOG for Lists feature"
```

---

### Task 14: Final Verification

**Steps:**

- [ ] **14.1: Build project**

```bash
pnpm build
```

Expected: Build succeeds with no TypeScript errors

- [ ] **14.2: Lint**

```bash
pnpm lint
```

Expected: No violations

- [ ] **14.3: Check feature branch status**

```bash
git log --oneline -15
git status
```

Expected: Clean working tree, 14+ commits

- [ ] **14.4: Final commit summary**

```bash
git log --oneline feature/lists..develop | wc -l
```

Expected: Shows count of commits on feature branch

- [ ] **14.5: Create PR (when ready)**

```bash
gh pr create --base develop --head feature/lists --title "feat: add Lists (Collections) feature" --body "Implements full user-curated collections feature with public discovery, dashboard management, and profile integration"
```

---

## Summary

**Implementation Complete!**

### What was built:

- ✅ **Phase 1:** 9 service functions, 9 TanStack Query hooks, complete TypeScript types
- ✅ **Phase 2:** Dashboard pages for CRUD list and item management
- ✅ **Phase 3:** Public discover page with type filtering, public detail pages with sharing
- ✅ **Phase 4:** User profile integration showing lists, dashboard navigation
- ✅ **Documentation:** README and CHANGELOG updated

### Total effort: ~15-17 hours (across 4 phases)

### Files created: 30+
### Files modified: 5

### Routes implemented:
- Public: `/lists`, `/lists/[id]`
- Protected: `/dashboard/lists`, `/dashboard/lists/new`, `/dashboard/lists/[id]`
- Integration: `/user/[id]` (Lists tab)

### Next steps after completion:
1. Create feature branch and implement using this plan
2. Test all flows locally
3. Submit PR to `develop`
4. Request code review
5. Deploy to staging for QA
6. Merge to main when approved

---

**Plan saved and ready for execution!**
