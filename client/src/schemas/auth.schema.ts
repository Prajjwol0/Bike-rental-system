import { z } from "zod";



export const registerSchema = z
  .object({
    email: z.email("Invalid email"),
    username: z.string().min(2, "Name must be at least 2 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

//loginSchema
export const loginSchema = z.object({
  email: z.email("Invalid email "),

  password: z.string().min(6, "password must be at least 6 characters")

    
   
});

export type LoginSchema = z.infer<typeof loginSchema>;
