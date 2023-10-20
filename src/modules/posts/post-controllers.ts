import { FastifyReply, FastifyRequest } from "fastify";
import { CreatePostInput, DeletePostSchema, UpdatePostSchema } from "./post-schema";
import { createPost, deletePost, getPosts, getPostsById, updatePost } from "./post-service";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, SUCCESS } from "../../config/httpStatus";


export async function createPostHandler(
    request: FastifyRequest<{Body: CreatePostInput, Params: { authorId: string }}>,
    reply: FastifyReply
  ) {
    const { authorId } = request.params;

    if(!request.body) {
      return reply.code(BAD_REQUEST).send({
        message: "Please inform the title and content."
      })
    }
    
    try {
      await createPost({
        ...request.body,
        authorId: authorId
      });
  
      return {
        status: reply.code(SUCCESS).send({
          message: "Post created successfully!"
        })
      }
    } catch (error) {
      reply.code(INTERNAL_SERVER_ERROR).send({
        message: error
      })
    }
}

export async function getPostsByIdHandler(
  request: FastifyRequest<{ Params: { authorId: string }}>,
  reply: FastifyReply
) {

  if(!request.params.authorId) {
    return reply.code(BAD_REQUEST).send({
      message: "Posts was not found!."
    })
  }
  
  const { authorId } = request.params;
  
  const posts = await getPostsById(authorId)

  if(!posts) {
    return reply.code(NOT_FOUND).send({
      message: "Posts not found!"
    })
  }

  return posts;

}

export async function updatePostByIdHandler(
  request: FastifyRequest<{ Body: UpdatePostSchema }>,
  reply: FastifyReply
) {

  const { id, title, content } = request.body;

  try {
    await updatePost( id, title, content )
    return {
      status: reply.code(SUCCESS).send({
        message: "Post updated successfully!"
      })
    }

  } catch (error) {
    return reply.code(INTERNAL_SERVER_ERROR).send({
      message: error
    })
  }
}

export async function deletePostByIdHandler(
  request: FastifyRequest<{ Body: DeletePostSchema }>,
  reply: FastifyReply
) {

  const { id } = request.body;
  try {
    
    await deletePost( id )
    return {
      status: reply.code(SUCCESS).send({
        message: "Post deleted successfully!"
      })
    }

  } catch (error) {
    return reply.code(INTERNAL_SERVER_ERROR).send({
      message: error
    })
  }
}


export async function getAllPostsHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const posts = await getPosts();
    return posts;
  } catch (error) {
    return reply.code(INTERNAL_SERVER_ERROR).send({
      message: error
    })
  }
}