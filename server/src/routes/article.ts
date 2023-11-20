import { FastifyInstance } from 'fastify';
import pdf from 'pdf-parse';
import { z } from 'zod';

import axios from 'axios';
import { prisma } from '../lib/prisma';

export async function articlesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/article', async (request) => {
    const { sub: userId } = request.user

    const files = await prisma.files.findMany({
      where: {
          userId,
          },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          }
        }
      }
    })

    return files.map((file) => {
      return {
        id: file.id,
        coverUrl: file.coverUrl,
        createdAt: file.createdAt,
        author: file.user,
        description: file.description,
        title: file.title,
      }
    })
  })

  app.get('/article/:id', async (request, reply) => {
    const { sub: userId } = request.user;

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const file = await prisma.files.findUniqueOrThrow({
      where: {
        id,
      }, include: {
        user: {
          select: {
            name: true,
            profilePic: true,
            id: true
          },
        },
        FileActions: {
          where: {
            userId
          }, 
          select: {
            actions: {
              select: {
                word: true,
                category: {
                  select: {
                    id: true,
                    color: true,
                    category: true
                  }
                },
              }, 
            }
          }
        }
      }
    })

    if (file.userId !== userId) {
      return reply.status(401).send()
    }


    const pdfPath = file.coverUrl;

    async function extractTextFromPDF(pdfPath: string) {
      try {
        const response = await axios.get(pdfPath, { responseType: 'arraybuffer' });
        const data = await pdf(response.data);

        const paragraphs = data.text.split('\n').filter(paragraph => paragraph.trim() !== '');
        return paragraphs
      } catch (error) {
        console.error('Erro ao extrair texto do PDF:', error);
      }
    }
    
    let paragraphs = await extractTextFromPDF(pdfPath);

    const categories = await prisma.categories.findMany({
      select: {
        id: true,
        category: true,
        color: true,
        description: true,
        resumedDescription: true
      }
    });

    if (paragraphs) {
      let words: { word: string; category: { id: number; category: string; color: string; }; }[] = []
      const actions = file.FileActions.forEach((fileAction) => {
        return fileAction.actions.map((actions) => {
          words.push(actions)
        });
      });
    
      const objectToReturn = {
        fileData: {
          id: file.id,
          file: paragraphs,
          description: file.description,
          title: file.title,
          coverUrl: file.coverUrl,
          user: {
            name: file.user.name,
            profilePic: file.user.profilePic,
            id: file.user.id,
          },
          createdAt: file.createdAt,
          actions: words,
        },
        categories: {
          categories,
        },
      };
      return objectToReturn;
    }
    

    return file
  })

  app.post('/article', async (request) => {
    const { sub: userId } = request.user

    const bodySchema = z.object({
      title: z.string(),
      description: z.string(),
      coverUrl: z.string(),
      articleCover: z.string(),
      category: z.number()
    })

    const { coverUrl, title, description, articleCover, category } = bodySchema.parse(request.body)

    const file = await prisma.files.create({
      data: {
        description,
        coverUrl,
        userId,
        title,
        articleCover,
        categoriesId: category
      },
    })

    await prisma.points.create({
      data: {
        userId,
        categoryId: 2
      }
    })
    return file
  })

//   app.put('/memories/:id', async (request, reply) => {
//     const { sub: userId } = request.user

//     const paramsSchema = z.object({
//       id: z.string().uuid(),
//     })

//     const { id } = paramsSchema.parse(request.params)

//     const bodySchema = z.object({
//       content: z.string(),
//       coverUrl: z.string(),
//     })

//     const { content, coverUrl } = bodySchema.parse(request.body)

//     let memory = await prisma.memory.findUniqueOrThrow({
//       where: {
//         id,
//       },
//     })

//     if (memory.userId !== userId) {
//       return reply.status(401).send()
//     }

//     memory = await prisma.memory.update({
//       where: {
//         id,
//       },
//       data: {
//         content,
//         coverUrl,
//       },
//     })

//     return memory
//   })

  app.delete('/article/:id', async (request, reply) => {
    const { sub: userId } = request.user

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const files = await prisma.files.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (files.userId !== userId) {
      return reply.status(401).send()
    }

    await prisma.files.delete({
      where: {
        id,
      },
    })
  })
}