"use client";

import { Box, BoxProps, forwardRef, useStyleConfig } from "@chakra-ui/react";

/* Panel — base card container (styles live in theme/index.ts) */
export interface PanelProps extends BoxProps {
  variant?: "base" | "interactive" | "flat";
  size?: "sm" | "md" | "lg";
}

export const Panel = forwardRef<PanelProps, "div">(({ variant, size, ...rest }, ref) => {
  const styles = useStyleConfig("Panel", { variant, size });
  return <Box ref={ref} __css={styles} {...rest} />;
});
