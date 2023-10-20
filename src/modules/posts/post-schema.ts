import * as z from "zod";

const postInput = {
    title: z.string({
        required_error: "Title is required."
    }),
    content: z.string({
        required_error: "Content is required."
    }).min(100),
};

const postGenerated = {
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
};

export const createPostSchema = z.object({
    ...postInput
});

export const  updatePostSchema = z.object({
    id: z.string(),
    title: z.string({
        required_error: "Title is required."
    }),
    content: z.string({
        required_error: "Content is required."
    }).min(100)
})

export const  deletePostSchema = z.object({
    id: z.string()
})


export const postResponseSchema = z.object({
    ...postInput,
    ...postGenerated,
    published: z.boolean(),
    author: z.object({
        id: z.string(),
        username: z.string()
    })
});

export const postsResponseSchema = z.array(postResponseSchema);


//Types

export type CreatePostInput = z.infer<typeof createPostSchema>;

export type PostsResponseSchema = z.infer<typeof postsResponseSchema>

export type PostResponseSchema = z.infer<typeof postResponseSchema>

export type UpdatePostSchema = z.infer<typeof updatePostSchema>

export type DeletePostSchema = z.infer<typeof deletePostSchema>




