import { FastifyInstance } from 'fastify';
import { deleteUserHandler, loginHandler, registerUserHandler, updateUserHandler } from './user-controllers';
import { 
    serializerCompiler, 
    validatorCompiler, 
    ZodTypeProvider 
} from "fastify-type-provider-zod";
import { 
    createUserSchema, 
    createUserResponseSchema, 
    loginSchema,
    loginResponseSchema,
    updateUserSchema,
    updateUserResponseSchema
} from './user-schema';
import { verifyJwt } from '../../utils/check-token';



export async function userRoutes(app: FastifyInstance) {
    //necessarios para usar os schemas do zod
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/create-user",
        schema: {
            body: createUserSchema,
            response: {
                201: createUserResponseSchema,
            }
        },
        handler: registerUserHandler
    })

    app.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/login",
        schema: {
            body: loginSchema,
            response: {
                200: loginResponseSchema
            }
        },
        handler: loginHandler
    })

    app.withTypeProvider<ZodTypeProvider>().route({
        method: "PUT",
        url: "/update/:id",
        onRequest: [verifyJwt],
        schema: {
            body: updateUserSchema,
            response: {
                200: updateUserResponseSchema,
            }
        },
        handler: updateUserHandler
    })

    app.withTypeProvider<ZodTypeProvider>().route({
        method: "DELETE",
        url: "/delete/:id",
        onRequest: [verifyJwt],
        handler: deleteUserHandler
    })

}