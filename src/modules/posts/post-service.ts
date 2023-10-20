import { prisma } from '../../config/prisma';
import { CreatePostInput } from './post-schema';

export async function createPost(
    data: CreatePostInput & { authorId: string }
) {

    return prisma.post.create({
        data,
        include: {
            author: {
                select: {
                    username: true,
                    id: true
                }
            }
        }
    })
};

export async  function getPosts() {
    return await prisma.post.findMany({
        select: {
            id: true,
            content: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            published: true,
            author: {
                select: {
                    id: true, 
                    username: true
                }
            }
        },
    });
}

export async  function getPostsById(
    authorId: string
) {
    return await prisma.post.findMany({
        where: { authorId },
        select: {
            id: true,
            content: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            published: true,
            author: {
                select: {
                    username: true,
                    id: true,
                },
            },
        },
    });
}

export async function updatePost(id: string, title: string, content: string) {

    return await prisma.post.update({
        where: { id },
        data: {
            title,
            content
        }
    })
}

export async function deletePost(id: string) {
    return await prisma.post.delete({ where: { id } })
}