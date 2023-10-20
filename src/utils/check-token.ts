import { FastifyReply, FastifyRequest } from "fastify";
import { UNAUTHORIZED } from "../config/httpStatus";

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply): Promise<unknown> {
	try {
		await request.jwtVerify();
	} catch (err) {
		return reply.code(UNAUTHORIZED).send({ message: 'Access token was not informed.' });
	}
}
