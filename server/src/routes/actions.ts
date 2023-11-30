import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function actionsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    app.post('/actions', async (request, reply) => {
        const { sub: userId } = request.user;
        console.log(request.body)
        
        const wordsSchema = z.object({
            word: z.string(),
            category: z.object({
                category: z.string(),
                color: z.string(),
                id: z.number(),
                resumedDescription: z.string(),
                description: z.string()
            })
        });

        const paramsSchema = z.object({
            fileId: z.string().uuid(),
            words: z.array(wordsSchema)
        });
        console.log(request.params)
        const { fileId, words } = paramsSchema.parse(request.body);

        const hasFileActions = await prisma.fileActions.findFirst({
            where: {
              AND: [
                {
                    userId
                }, {
                    fileId
                }
              ] 
            },
          });

          if (!hasFileActions) {
            const fa = await prisma.fileActions.create({
                data: {
                    fileId,
                    userId
                }
            })

            words.forEach(async (word) => {
                await prisma.actions.create({
                    data: {
                        word: word.word,
                        categoriesId: word.category.id,
                        fileActionsId: fa.id
                    }
                })
            })

            await prisma.points.create({
                data: {
                    categoryId: 1,
                    userId
                }
            })
          } else {
            words.forEach(async (word) => {
                await prisma.actions.upsert({
                    create: {
                        word: word.word,
                        categoriesId: word.category.id,
                        fileActionsId: hasFileActions.id,
                    }, update: {
                        // categoriesId: word.category.id,
                    }, where: {
                        id: hasFileActions.id,
                        AND: [
                            {
                                fileActionsId: hasFileActions.id,
                            }, {
                                word: word.word
                            }
                        ]
                    }
    
                })
            })
          }

          const actionsByUser = await prisma.fileActions.findFirst({
            where: {
                userId,
                fileId
            }, include: {
                actions: {
                    select: {
                        category: true,
                        FileActions: true,
                        id: true,
                        word: true
                    }
                }, file: {
                    select: {
                        coverUrl: true,
                        description: true,
                        title: true,
                        createdAt: true,
                        user: {
                            select: {
                                name: true,
                                profilePic: true,
                                id: true
                            }
                        }
                    }
                }
            }
        })
//         id: string;
//     file: string[];
//     description: string;
//     title: string;
//     coverUrl: string;
//     user: {
//         name: string;
//         profilePic: string;
//         id: string;
//     };
//     createdAt: Date;
//     isPublic: boolean;
//     actions: word_type[];
// }
        return {
            id: actionsByUser?.fileId,

        }
    });
    
}