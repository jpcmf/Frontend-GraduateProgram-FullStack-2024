"use client";

import { Grid } from "@chakra-ui/react";

import { skaters } from "../../../../mock";
import { SkaterCard } from "../User/Card";

export const SkaterGrid = () => (
  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
    {skaters.map(s => (
      <SkaterCard key={s.name} s={s} />
    ))}
  </Grid>
);
