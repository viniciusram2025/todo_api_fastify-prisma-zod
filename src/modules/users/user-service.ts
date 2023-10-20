import { encryptedPassword } from "../../utils/hash-password";
import { prisma } from "../../config/prisma";
import { CreateUserInput, UpdateUserSchema } from "./user-schema";

export async function createUser(input: CreateUserInput) {
  const { password, confirmPassword, ...rest } = input;
  
  const { hashPassword, salt } = encryptedPassword(password)

   const user = await prisma.user.create({
    data: {
      ...rest,
      salt: salt,
      password: hashPassword,
    }
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

export async function findUserByEmail(email: string) {
  
    const user =  await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
}

export async function findUserById(id: string) {
  
  const user =  await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
}

export async function updateUser(id: string, username: string, email: string, password: string, salt: string) {

  return await prisma.user.update({
    where: { id },
    data: {
      username,
      email,
      password,
      salt
    }, 
  })
}

export async function deleteUser(id: string) {

  return await prisma.user.delete({ where: { id } })
}