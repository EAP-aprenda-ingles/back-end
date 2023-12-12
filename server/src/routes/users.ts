import { hash } from "bcrypt";
import { randomInt } from "crypto";
import { FastifyInstance } from "fastify";
import fs from "fs";
import path, { resolve } from "path";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function userRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    app.get('/user/:id', async (request, reply) => {
        const { sub: userId } = request.user;
        const paramsSchema = z.object({
            id: z.string().uuid() 
        })
        const { id } = paramsSchema.parse(request.params)
        if (id === userId) {
            const user = await prisma.users.findUniqueOrThrow({
                select: {
                    name: true,
                    id: true,
                    profilePic: true,
                    description: true,
                    School: true,
                    isPublic:true
                },
                where: {
                  id,
                }
            })
            const fullURL = request.protocol.concat('://').concat(process.env.CURRENT_URL ?? '')
            const fileURL = new URL(user.profilePic, fullURL).toString()
            user.profilePic = fileURL
            return {
                id: user.id,
                isPublic: user.isPublic,
                profilePic: user.profilePic,
                name: user.name,
                school: user.School,
                description: user.description,
            }
        } else {
            return reply.status(401).send("Para ter acesso a este endpoint você deve passar o seu id de usuário como parâmetro!")
        }
    })

    app.get('/users/:id', async (request, reply) => {
        const { sub: userId } = request.user;
        const paramsSchema = z.object({
            id: z.string().uuid() 
        })
        const { id } = paramsSchema.parse(request.params)
        const user = await prisma.users.findUniqueOrThrow({
            select: {
                School: true,
                files: {
                    select: {
                        id: true,
                        coverUrl: true,
                        articleCover: true
                    }, orderBy: {
                        createdAt: 'desc'
                    }
                },
                name: true,
                Followers: {
                    select: {
                        userId: true
                    }
                },
                Following: {
                    select: {
                        id: true
                    }
                },
                isPublic: true,
                saveOnFeed: {
                    select: {
                        file: {
                            select: {
                                id: true,
                                articleCover: true,
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        profilePic: true
                                    }
                                }
                            }
                        }
                    }
                },
                id: true,
                Preferences: true,
                profilePic: true,
                description: true
            },
            where: {
              id,
            }
        })
        const followedByUser = user.Followers.some((follower) => follower.userId === userId);
        const fullURL = request.protocol.concat('://').concat(process.env.CURRENT_URL ?? '')
        const fileURL = new URL(user.profilePic, fullURL).toString()
        user.profilePic = fileURL
        // if (!user.isPublic && !followedByUser && user.id !== userId) {
        //     return reply.status(401).send("Você não tem permissão para acessar este perfil!")
        // }
        if (user.isPublic || followedByUser || user.id === userId) {
            const savedPosts = user.saveOnFeed.map((item) => {
                const fileURL = new URL(item.file.articleCover, fullURL).toString()
                return {
                    id: item.file.id,
                    articleCover: fileURL,
                    user: {
                        id: item.file.user.id,
                        name: item.file.user.name,
                        profilePic: item.file.user.profilePic
                    }
                }
            })
            return {
                id: user.id,
                preferences: user.Preferences,
                profilePic: user.profilePic,
                followers: user.Followers.length,
                following: user.Following.length,
                name: user.name,
                articles: user.files,
                school: user.School,
                description: user.description,
                isPublic: user.isPublic,
                followedByUser,
                savedPosts
            }
        } else {
            return {
                id: user.id,
                preferences: user.Preferences,
                profilePic: user.profilePic,
                followers: user.Followers.length,
                following: user.Following.length,
                name: user.name,
                school: user.School,
                description: user.description,
                isPublic: user.isPublic,
                articles: [],
                savedPosts: [],
                followedByUser
            }
        }
    });

    app.get('/users/community', async (request, reply) => {
        const { sub: userId } = request.user;
        const user = await prisma.users.findUniqueOrThrow({
            select: {
                Followers: {
                    select: {
                        userId: true
                    }
                },
                Following: {
                    select: {
                        id: true
                    }
                },
                id: true,
            },
            where: {
              id: userId,
            }
        })
        return {
            id: user.id,
            followers: user.Followers,
            following: user.Following,
        }
    })
    app.put('/users/:id', async (request, reply) => {
        const { sub: userId } = request.user

        const paramsSchema = z.object({
            id: z.string().uuid() 
        })

        const { id } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            name: z.string().optional(),
            profilePic: z.string().optional(),
            description: z.string().optional(),
            schoolId: z.number().optional(),
            isPublic: z.coerce.boolean().optional(),
            preferences: z.array(z.number())
        })

        const { name, profilePic, description, schoolId, preferences, isPublic } = bodySchema.parse(request.body)

        let user = await prisma.users.findUniqueOrThrow({
            where: {
                id,
            }, include: {
                School: true,
                Preferences: true
            }
        })

        if (userId !== id) {
            return reply.status(401).send()
        }

        let newProfilePic = "";

        const parsedUrl = new URL(profilePic ?? '');
        const pathWithoutDomain = parsedUrl.pathname;
        newProfilePic = pathWithoutDomain;

        if (profilePic !== user.profilePic) {
            const profilePicName = user.profilePic.split('/');
            const ppPath = resolve(__dirname, '../../uploads/profilePics/', profilePicName[profilePicName.length - 1]);

            if (fs.existsSync(ppPath)) {
                fs.unlink(ppPath, (err) => {
                    if (err) {
                        console.error(`Erro ao excluir o arquivo: ${err}`);
                    } else {
                        console.log('Arquivo excluído com sucesso.');
                    }
                });
            } else {
                console.log('O arquivo não existe no caminho especificado.');
            }
        }


        await prisma.users.update({
            where: {
                id
            },
            data: {
                name,
                description,
                isPublic,
                Preferences: {
                    disconnect: user.Preferences.map(preference => ({id: preference.id})) ,
                    connect: preferences.map(preferenceId => ({ id: preferenceId }))
                },
                schoolsId: schoolId,
                profilePic: newProfilePic
            }
        })

        let updatedUser = await prisma.users.findUniqueOrThrow({
            where: {
                id
            },
            select: {
                name: true,
                createdAt: true,
                profilePic: true,
                id: true
            }
        })
        

        const fullURL = request.protocol.concat('://').concat(process.env.CURRENT_URL ?? '')
        const fileURL = new URL(updatedUser.profilePic, fullURL).toString()
        const token = app.jwt.sign(
            {
                name: updatedUser.name,
                createdAt: updatedUser.createdAt,
                profilePic: fileURL
            },
            {
                sub: updatedUser.id,
                expiresIn: '15 days'
            }
        )
        return { token }
    });

    app.put('/login', async (request, reply) => {
        const { sub: userId } = request.user
        const bodySchema = z.object({
            login: z.string({
                required_error: "O campo 'e-mail' é obrigatório!",
            }).email(),
            password: z.string({
                required_error: "O campo 'senha' é obrigatório!",
            })
        })
        const { login, password } = bodySchema.parse(request.body)

        let user = await prisma.users.findUniqueOrThrow({
            where: {
                login,
                id: userId
            }
        })

        if (user) {
            const randomSalt = randomInt(10, 16)
            const passwordHash = await hash(password, randomSalt)

            await prisma.users.update({
                where: {
                    id: user.id
                },
                data: {
                    password: passwordHash
                }
            })

            const updatedUser = await prisma.users.findUniqueOrThrow({
                where: {
                    login,
                }, select: {
                    createdAt: true,
                    profilePic: true,
                    name: true
                }
            })
            const fullURL = request.protocol.concat('://').concat(process.env.CURRENT_URL ?? '')
            const fileURL = new URL(updatedUser.profilePic, fullURL).toString()
            const token = app.jwt.sign(
                {
                    name: updatedUser.name,
                    createdAt: updatedUser.createdAt,
                    profilePic: fileURL,
                },
                {
                    sub: userId,
                    expiresIn: '15 days'
                }
            )
            return { token }
        }
    })

    app.delete('/users/:id', async (request, reply) => {
        const { sub: userId } = request.user

        const paramsSchema = z.object({
          id: z.string().uuid(),
        })
    
        const { id } = paramsSchema.parse(request.params)

        const user = await prisma.users.findUniqueOrThrow({
            where: {
                id
            }
        })

        if (userId !== id) {
            return reply.status(401).send()
        }

        await prisma.users.delete({
            where: {
                id
            }
        })
    })
}