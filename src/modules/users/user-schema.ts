import * as z from "zod";

const userDefault = {
    username: z.string({
        required_error: "User is required.",
        invalid_type_error: "The name must contain only characters.",
    }).min(5),
    email: z.string({
        required_error: "Email is required.",
        invalid_type_error: "Email must be a string",
    }).email({
        message: "Invalid email address."
    }),
};

export const createUserSchema = z.object({
    ...userDefault,
    password: z.string(),
    confirmPassword: z.string(),
})

export const createUserResponseSchema = z.object({
    id: z.string(),
    ...userDefault,
})

export const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required.",
        invalid_type_error: "Email must be a string.",
    }).email({
        message: "Invalid email address."
    }),
    password: z.string(),
});



export const loginResponseSchema = z.object({
    token: z.string(),
});

export const updateUserSchema = z.object({
    email: z.string({
        required_error: "Email is required.",
        invalid_type_error: "Email must be a string.",
    }).email({
        message: "Invalid email address."
    }),
    password: z.string(),
    username: z.string({
        required_error: "User is required.",
        invalid_type_error: "The name must contain only characters.",
    }).min(5),
})

export const updateUserResponseSchema = z.object({
    id: z.string(),
    ...userDefault
})



export type CreateUserInput = z.infer<typeof createUserSchema>

export type LoginInput = z.infer<typeof loginSchema>

export type CheckToken = z.infer<typeof createUserResponseSchema>

export type UpdateUserSchema = z.infer<typeof updateUserSchema>