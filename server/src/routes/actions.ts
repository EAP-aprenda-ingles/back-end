import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

interface Word {
    word: string;
    category: {
        id: number;
    };
}

export async function actionsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
   })

    app.post('/actions', async (request, reply) => {
        const { sub: userId } = request.user;
        console.log(request.body);

        const wordsSchema = z.object({
            word: z.string(),
            category: z.object({
                id: z.number()
            }),
            line: z.number()
        });

        const paramsSchema = z.object({
            fileId: z.string().uuid(),
            words: z.array(wordsSchema)
        });

        const { fileId, words } = paramsSchema.parse(request.body);

        let existingFileActions = await prisma.fileActions.findFirst({
            where: {
                userId,
                fileId
            },
            include: {
                actions: true
            }
        });
    
        if (!existingFileActions) {
            existingFileActions = await prisma.fileActions.create({
                data: {
                    fileId,
                    userId
                },
                include: {
                    actions: true
                }
            });
            await prisma.points.create({
                data: {
                    categoryId: 1,
                    userId
                }
            });
            return {
                id: existingFileActions.fileId,
                actions: existingFileActions.actions
            };
        } else if (existingFileActions) {
            const actionsInDB = existingFileActions.actions;
            const actionsToCreate = words.filter(newWord =>
              !actionsInDB.some(action => action.word === newWord.word && action.line === newWord.line)
            );
            const actionsToUpdate = words.filter(newWord =>
              actionsInDB.some(action => action.word === newWord.word && action.line === newWord.line)
            );
            const actionsToDelete = actionsInDB.filter(action =>
              !words.some(word => word.word === action.word && word.line === action.line)
            );
          
            const createActionsPromises = actionsToCreate.map((word: any) =>
              prisma.actions.create({
                data: {
                  word: word.word,
                  categoriesId: word.category.id,
                  fileActionsId: existingFileActions.id,
                  line: word.line,
                },
              })
            );
          
            await Promise.all(createActionsPromises);
          
            await Promise.all(
              actionsToUpdate.map(async word => {
                const existingAction = actionsInDB.find(
                  action => action.word === word.word && action.line === word.line
                );
                if (existingAction) {
                  return prisma.actions.update({
                    where: { id: existingAction.id },
                    data: { categoriesId: word.category.id },
                  });
                }
              })
            );
          
            await prisma.actions.deleteMany({
              where: { id: { in: actionsToDelete.map(action => action.id) } },
            });
          
            const updatedFileActions = await prisma.fileActions.findFirst({
              where: {
                userId,
                fileId,
              },
              include: {
                actions: true,
              },
            });
          
            return {
              id: updatedFileActions?.fileId,
              actions: updatedFileActions?.actions || [],
            };
          }
    });
}
