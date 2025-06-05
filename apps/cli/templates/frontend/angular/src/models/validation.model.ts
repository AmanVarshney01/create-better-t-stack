import { z } from "zod";

const signUpSchema = z
 .object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
 });
const loginSchema = z.object({
 email: z.string().email("Invalid email address"),
 password: z.string().min(1, "Password is required"),
 rememberMe: z.boolean(),
});

const todoSchema = z.object({
 todo: z.string().nonempty("Todo is required"),
});
export {
 signUpSchema,
 loginSchema,
 todoSchema,
};

type LoginSchema = z.infer<typeof loginSchema>;
type SignUpSchema = z.infer<typeof signUpSchema>;
type TodoSchema = z.infer<typeof todoSchema>;
export type { LoginSchema, SignUpSchema, TodoSchema };
