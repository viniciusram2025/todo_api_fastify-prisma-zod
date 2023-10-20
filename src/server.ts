import fastifyJwt, { JWT } from '@fastify/jwt';
import Fastify from 'fastify';
import { userRoutes } from './modules/users/user-routes';
import { postRoutes } from './modules/posts/post-routes';
import { API_SECRET } from './config/secrets';

declare module "fastify" {
    interface FastifyRequest {
      jwt: JWT;
    }
}
declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            id: string;
            email: string;
            username: string;
        };
    }
}

  
export function buildServer() {
    const app = Fastify();

    app.register(fastifyJwt, {
        secret: API_SECRET
    }); 

    
    app.register(userRoutes, { prefix: "api/users" });
    app.register(postRoutes, { prefix: "api/posts" });

    return app;

}


