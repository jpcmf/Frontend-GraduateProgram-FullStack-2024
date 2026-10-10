"use client";

import { Grid } from "@chakra-ui/react";

import type { UserBasics } from "@/features/user";

import { SkaterCard } from "../User/Card";

export const SkaterGrid = ({ users }: { users: UserBasics[] }) => (
  <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} gap={4}>
    {users.map(user => (
      <SkaterCard key={user.id} s={user} />
    ))}
  </Grid>
);
