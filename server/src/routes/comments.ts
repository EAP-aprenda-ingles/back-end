
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function commentsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })
  app.get('/comments/:articleId', async (request, reply) => {

    const paramsSchema = z.object({
      articleId: z.string().uuid(),
    })

    try {
      const { articleId } = paramsSchema.parse(request.params)

      const comments = await prisma.comments.findMany({
        where: {
          filesId: articleId,
        }, include: {
          user: {
            select: {
              School: true,
              name: true,
              profilePic: true,
              id: true
            }
          },
        },
      })

      return comments.map((comment) => {
        return {
          id: comment.id,
          user: comment.user,
          content: comment.content,
        }
      })
    } catch (error) {
      reply.status(400).send({
        error: "Invalid articleId",
        message: error.message,
      })
    }
  })
  app.post('/comments/:articleId', async (request, reply) => {
    const { sub: userId } = request.user
    const paramsSchema = z.object({
      articleId: z.string().uuid(),
    })

    const bodySchema = z.object({
      content: z.string(),
    })

    try {
      const { articleId } = paramsSchema.parse(request.params)
      const { content } = bodySchema.parse(request.body)

      const comment = await prisma.comments.create({
        data: {
          content,
          filesId: articleId,
          usersId: userId
        }, select: {
          file: {
            select: {
              user: {
                select: {
                  name: true,
                  id: true,
                }
              }
            }
          }
        }
      })

      const user = await prisma.users.findUniqueOrThrow({
        where: {
          id: userId
        }
      })

      if (userId !== comment.file.user.id) {
        await prisma.notifications.create({
          data: {
            userId: comment.file.user.id,
            content: `${user.name} comentou em seu artigo`,
            type: 'comment'
          }
        })
      }

      if (comment) {
        const comments = await prisma.comments.findMany({
          where: {
            filesId: articleId
          }, select: {
            content: true,
            happenedAt: true,
            id: true,
            user: {
              select: {
                createdAt: true,
                id: true,
                name: true,
                profilePic: true
              }
            }
          }
        })
        return comments
      } else {
        reply.status(409).send('Impossible to create a comment')
      }
    } catch (error) {
      reply.status(400).send({
        error: "Invalid articleId or content",
        message: error.message,
      })
    }
  })
}