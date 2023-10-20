import { FastifyInstance } from 'fastify';
import { 
    serializerCompiler, 
    validatorCompiler, 
    ZodTypeProvider 
} from "fastify-type-provider-zod";
import { 
    createPostSchema, 
    deletePostSchema, 
    postResponseSchema,
    postsResponseSchema, 
    updatePostSchema 
} from './post-schema';
import { 
    createPostHandler, 
    deletePostByIdHandler, 
    getAllPostsHandler, 
    getPostsByIdHandler, 
    updatePostByIdHandler 
} from './post-controllers';
import { verifyJwt } from '../../utils/check-token';


export async function postRoutes(app: FastifyInstance) {
    //necessarios para usar os schemas do zod
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'POST',
        url: "/create/user/:authorId",
        onRequest: [verifyJwt],
        schema: {
            body: createPostSchema,
            response: {
                201: postResponseSchema,
            },
        },
        handler: createPostHandler
    });


    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: "/find-posts",
        schema: {
            response: {
                200: postsResponseSchema
            },
        },
        handler: getAllPostsHandler
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'GET',
        url: "/user/:authorId",
        onRequest: [verifyJwt],
        schema: {
            response: {
                200: postsResponseSchema,
            },
        },
        handler: getPostsByIdHandler
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'PUT',
        url: "/user/:authorId",
        onRequest: [verifyJwt],
        schema: {
            body: updatePostSchema,
            response: {
                200: postResponseSchema,
            },
        },
        handler: updatePostByIdHandler
    });

    app.withTypeProvider<ZodTypeProvider>().route({
        method: 'DELETE',
        url: "/delete",
        onRequest: [verifyJwt],
        schema: {
            body: deletePostSchema
        },
        handler: deletePostByIdHandler
    });

}
