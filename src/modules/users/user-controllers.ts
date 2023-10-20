import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginInput, UpdateUserSchema } from "./user-schema";
import { createUser, deleteUser, findUserByEmail, updateUser } from "./user-service";
import { comparePassword, encryptedPassword } from "../../utils/hash-password";
import { API_SECRET } from "../../config/secrets";
import { BAD_REQUEST, NOT_FOUND, SUCCESS, UNAUTHORIZED } from "../../config/httpStatus";
import jwt from 'jsonwebtoken';

export async function registerUserHandler(
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ) {
  const body = request.body;

  if(body.password !== body.confirmPassword) {
    return reply.code(BAD_REQUEST).send({
        message: "Passowrd doesn't match."
    })
  }

  const userBd = await findUserByEmail(body.email)

  if(body.username === userBd?.username) {
    return reply.code(BAD_REQUEST).send({
      message: "User already exists."
    })
  }
  if(body.email === userBd?.email) {
    return reply.code(BAD_REQUEST).send({
      message: "Email already exists."
    })
  }


  try {
    const user = await createUser(body);
    return {
      user,
      message: "User Created Successfully."
    }

  } catch (error) {
    console.log(error);
    return reply.code(500).send(error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
  ) {
    
  const body = request.body;
  const user = await findUserByEmail(body.email);

  if(!user) {
    reply.code(BAD_REQUEST).send({
      message: "User was not found."
    });
  }


  if(user !== null) {
    const correctPassword = comparePassword({
        candidatePassword: body.password,
        hashPassword: user.password,
        salt: user.salt,
    });
    
    if(correctPassword) {
      const authUser = {
        id: user.id,
        username: user.username,
        email: user.email,
      } 
    
      const accessToken = jwt.sign({authUser}, API_SECRET, {expiresIn: '1d'})

      return {token: accessToken}
    }
  } 
    
  return reply.code(UNAUTHORIZED).send({
    message: "Invalid email or password",
  }); 

}

export async function updateUserHandler(
  request: FastifyRequest<{ Body: UpdateUserSchema, Params: { id: string } }>,
  reply: FastifyReply
  ) {
    const { id } = request.params
    const { username, email, password } = request.body
    
    const user = await findUserByEmail(email)
    if (!user) {
      return reply.code(NOT_FOUND).send({
        message: 'User was not found'
      });
    }

    const hash = encryptedPassword(password);

    try {
      await updateUser(id, username, email, hash.hashPassword, hash.salt)
      return {
        status: reply.code(SUCCESS).send({
          message: "User updated successfully",
          user: {
            id,
            username,
            email
          }
        })
      }
    } catch (error) {
      reply.code(BAD_REQUEST).send({
        message: 'Please fill in the fields correctly.',
        error: error
      });
    }
}

export async function deleteUserHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
  ) {
    const { id } = request.params

    try {
      await deleteUser(id)
      return {
        status: reply.code(SUCCESS).send({
          message: "User deleted successfully!"
        })
      }
    } catch (error) {
        return reply.code(NOT_FOUND).send({
          message: "User id not found"
        });
    }
}