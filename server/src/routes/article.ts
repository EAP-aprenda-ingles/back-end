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
    let userCategoriesIds: number[] = []
    const userCategories = await prisma.users.findUnique({
      where: {
        id: userId
      },
      select: {
        Preferences: {
          select: {
            id: true
          }
        }
      }
    })

    userCategories?.Preferences.forEach((preference) => userCategoriesIds.push(preference.id))

    const files = await prisma.files.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        OR: [
          {
            user: {
              isPublic: true
            }
          },
          {
            user: {
              Following: {
                some: {
                  followerId: userId
                }
              }
            }
          }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            profilePic: true,
            School: {
              select: {
                name: true,
                id: true
              }
            }
          }
        }, Comments: {
          select: {
            id: true
          },
        }, Likes: {
          select: {
            userId: true
          }
        },
        FileActions: {
          select: {
            userId: true
          }
        }
      }
    })

    let userFeed: ({
      Comments: {
          id: number;
      }[];
      Likes: {
          userId: string;
      }[];
      FileActions: {
        userId: string;
    }[];
      user: {
        id: string;
        name: string;
        createdAt: Date;
        profilePic: string;
        School: {
            id: number;
            name: string;
        };
    };
  } & {
      id: string;
      title: string;
      coverUrl: string;
      description: string;
      createdAt: Date;
      userId: string;
      categoriesId: number;
      articleCover: string;
  })[] = [];
    userFeed = files.filter((file) => userCategoriesIds.includes(file.categoriesId))

    return userFeed.map((file) => {
      const likedByUser = file.Likes.some((like) => like.userId === userId);
      const fullURL = request.protocol.concat('://').concat(request.hostname)
      const fileURL = new URL(file.user.profilePic, fullURL).toString()
      file.user.profilePic = fileURL
      let interactions = new Set(file.FileActions)
      return {
        id: file.id,
        coverUrl: file.coverUrl,
        createdAt: file.createdAt,
        author: file.user,
        description: file.description,
        title: file.title,
        category: file.categoriesId,
        articleCover: file.articleCover,
        likes: file.Likes.length,
        comments: file.Comments.length,
        likedByUser,
        fullComments: file.Comments,
        interactions: interactions.size
      }
    })
  })

  app.get('/article/page/:articleId', async (request) => {
    const { sub: userId } = request.user

    const paramsSchema = z.object({
      articleId: z.string().uuid(),
    })

    const { articleId } = paramsSchema.parse(request.params)

    
    const file = await prisma.files.findUniqueOrThrow({
      where: {
        id: articleId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            profilePic: true,
            School: {
              select: {
                name: true,
                id: true
              }
            }
          }
        }, Comments: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            },
            content: true
          },
        }, Likes: {
          select: {
            userId: true
          }
        },
        FileActions: {
          select: {
            userId: true
          }
        }
      }
    })
    
    const likedByUser = file.Likes.some((like) => like.userId === userId);
    const fullURL = request.protocol.concat('://').concat(request.hostname)
    const fileURL = new URL(file.user.profilePic, fullURL).toString()

    let interactions = new Set(file.FileActions)

    return {
        id: file.id,
        coverUrl: file.coverUrl,
        createdAt: file.createdAt,
        author: {
          id: file.user.id,
          name: file.user.name,
          profilePic: fileURL,
          createdAt: file.user.createdAt,
          School: file.user.School
        },
        description: file.description,
        title: file.title,
        category: file.categoriesId,
        articleCover: file.articleCover,
        likes: file.Likes.length,
        comments: file.Comments.length,
        likedByUser,
        fullComments: file.Comments.map(comment => { 
          const fullURL = request.protocol.concat('://').concat(request.hostname);
          const fileURL = new URL(comment.user.profilePic, fullURL).toString();
          return {
            id: comment.id,
            user: {
              id: comment.user.id,
              name: comment.user.name,
              profilePic: fileURL
            },
            content: comment.content
          };
        }),
        interactions: interactions.size
    }
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
            id: true,
            School: {
              select: {
                name: true
              }
            }
          }
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
                line: true,
                position: true
              }, 
            }
          }
        },
        category: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

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
      let words: { word: string; category: { id: number; category: string; color: string; }; line: number, position: number }[] = []
      file.FileActions.forEach((fileAction) => {
        return fileAction.actions.map((actions) => {
          words.push(actions)
        });
      });
    
      const fullURL = request.protocol.concat('://').concat(request.hostname)
      const fileURL = new URL(file.user.profilePic, fullURL).toString()
      file.user.profilePic = fileURL
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
            school: file.user.School.name
          },
          createdAt: file.createdAt,
          actions: words,
          category: file.category
        },
        categories: {
          categories,
        },
      };
      return objectToReturn;
    }
    

    return file
  })

  app.get('/article/author/:id', async (request, reply) => {
    const { sub: userId } = request.user;

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const resumedFile = await prisma.files.findUniqueOrThrow({
      where: {
        id
      }, include: {
        user: {
          select: {
            id: true
          }
        }
      }
    })

    const file = await prisma.files.findUniqueOrThrow({
      where: {
        id,
      }, include: {
        user: {
          select: {
            name: true,
            profilePic: true,
            id: true,
            School: {
              select: {
                name: true
              }
            }
          }
        },
        FileActions: {
          where: {
            userId: resumedFile.user.id
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
                line: true,
                position: true
              }, 
            }
          }
        },
        category: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

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
      let words: { word: string; category: { id: number; category: string; color: string; }; line: number, position: number }[] = []
      file.FileActions.forEach((fileAction) => {
        return fileAction.actions.map((actions) => {
          words.push(actions)
        });
      });
    
      const fullURL = request.protocol.concat('://').concat(request.hostname)
      const fileURL = new URL(file.user.profilePic, fullURL).toString()
      file.user.profilePic = fileURL
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
            school: file.user.School.name
          },
          createdAt: file.createdAt,
          actions: words,
          category: file.category
        },
        categories: {
          categories,
        },
      };
      return objectToReturn;
    }
    

    return file
  })

  app.get('/article/resumed/:id', async (request, reply) => {
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
        Comments: {
          select: {
            content: true,
            happenedAt: true,
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                createdAt: true
              }
            }
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    
      const objectToReturn = {
        id: file.id,
        description: file.description,
        title: file.title,
        coverUrl: file.coverUrl,
        user: {
          name: file.user.name,
          profilePic: file.user.profilePic,
          id: file.user.id,
        },
        createdAt: file.createdAt,
        comments: file.Comments,
        category: file.category
      };
      return objectToReturn;
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