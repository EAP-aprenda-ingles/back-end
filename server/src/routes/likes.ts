import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function likesRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
   })

   app.get('/likes/:postId', async (request, reply) => {

    const paramsSchema = z.object({
      postId: z.string().uuid(),
    })

    const { postId } = paramsSchema.parse(request.params)

    const likes = await prisma.likes.findMany({
      where: {
        postId,
      }
    })


    return likes
  })

  app.post('/likes', async (request) => {
    const { sub: userId } = request.user

    const bodySchema = z.object({
      postId: z.string(),
    })

    const { postId } = bodySchema.parse(request.body)

    const likeExists = await prisma.likes.findFirst({
        where: {
          userId,
          postId,
        },
      });

      if (likeExists) {
          await prisma.likes.delete({
              where: {
                    id: likeExists.id
              }
          })
    } else {
        await prisma.likes.create({
          data: {
            userId,
            postId
          },
        })
    }
    const post = await prisma.files.findUniqueOrThrow({
        where: {
            id: postId
        }, include: {
            user: {
                select: {
                    School: true,
                    name: true,
                    profilePic: true,
                    id: true
                }
            }, Comments: {
              select: {
                id: true
              },
            }, Likes: {
              select: {
                userId: true
              }
            }
          }
    })

    const likedByUser = post.Likes.some((like) => like.userId === userId);

    return {
        id: post.id,
        coverUrl: post.coverUrl,
        content: post.description.length > 115 ? post.description.substring(0, 115).concat('...') : post.description,
        createdAt: post.createdAt,
        user: {
          name: post.user.name,
          profilePic: post.user.profilePic,
          userSchool: post.user.School.name,
        },
        likes: post.Likes.length,
        comments: post.Comments.length,
        likedByUser
      }
  })
}