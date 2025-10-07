import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.string().email({ message: "E-mail deve ser um e-mail válido." }).min(1, { message: "Campo obrigatório." }),
  password: z.string().min(1, { message: "Campo obrigatório." })
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;
