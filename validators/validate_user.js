import { z } from 'zod';

const registerSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name must be at most 50 characters long" }),

    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .toLowerCase()
        .email({ message: "Invalid email address" }),

    password: z
        .string({ required_error: "Password is required" })
        .trim()
        .min(6, { message: "Password must be at least 6 characters long" }),

    role: z
        .enum(["customer", "seller", "admin", "delivery"], {
            errorMap: () => ({ message: "Incorrect Role" }),
        })
        .default("customer"),

   
    isVerified: z
        .boolean()
        .optional(),

    refreshToken: z
        .string()
        .trim()
        .optional()
        .default(""),

});

export { registerSchema };
