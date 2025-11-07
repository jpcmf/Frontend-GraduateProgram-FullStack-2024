import { z } from "zod";

import { VALIDATION_MESSAGES } from "@/lib/const/validation";

export const signInFormSchema = z.object({
  email: z
    .string()
    .email({ message: VALIDATION_MESSAGES.INVALID_EMAIL })
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED }),
  password: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED })
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;
