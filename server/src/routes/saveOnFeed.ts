import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function saveOnFeedRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
   })

   app.get('/saveOnFeed/:postId', async (request, reply) => {

        const paramsSchema = z.object({
        postId: z.string().uuid(),
        })

        const { postId } = paramsSchema.parse(request.params)

        const saveOnFeed = await prisma.saveOnFeed.findMany({
            where: {
                fileId: postId,
            }
        })

    })

    app.post('/saveOnFeed/:fileId', async (request, reply) => {
        const { sub: userId } = request.user;

        const paramsSchema = z.object({
            fileId: z.string().uuid(),
        })

        const { fileId } = paramsSchema.parse(request.params)

        const saveOnFeedExists = await prisma.saveOnFeed.findFirst({
            where: {
                userId,
                fileId,
            },
            select: {
                file: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                    }
                }
            }
        });

        if (saveOnFeedExists) {
            await prisma.saveOnFeed.delete({
                where: {
                    id: saveOnFeedExists.id
                }
            })
        } else {
            await prisma.saveOnFeed.create({
                data: {
                    userId,
                    fileId
                },
            })

            await prisma.notifications.create({
                data: {
                    userId: saveOnFeedExists.file.user.id,
                    content: `${saveOnFeedExists.file.user.name} salvou seu artigo no feed`,
                    type: 'saveOnFeed'
                }
            })

        }
        const post = await prisma.files.findUniqueOrThrow({
            where: {
                id: fileId
            }
        })
        return post
    })
}