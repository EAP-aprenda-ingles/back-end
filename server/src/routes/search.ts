import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function searchRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    app.post('/search', async (request, reply) => {
        const { sub: userId } = request.user;
        const paramsSchema = z.object({
            userName: z.string()
        })
        const { userName } = paramsSchema.parse(request.body);

        const users = await prisma.users.findMany({
            where: {
                name: {
                    contains: userName,
                }
            }, select: {
                School: true,
                name: true,
                profilePic: true,
                id: true,
                Followers: {
                    select: {
                        userId: true
                    }
                }
            }
        })
        
        return users.map((user) => {
            const followedByUser = user.Followers.some((follower) => follower.userId === userId);
            const fullURL = request.protocol.concat('://').concat(request.hostname)
            const fileURL = new URL(user.profilePic, fullURL).toString()
            user.profilePic = fileURL

          return {
            id: user.id,
            profilePic: user.profilePic,
            name: user.name.length >=15 ? user.name.substring(0, 15).concat('...') : user.name,
            school: user.School.name.length >=15 ? user.School.name.substring(0, 15).concat('...') : user.School.name,
            followedByUser
          }
        })
    })

    app.post('/search/followers/:id', async (request, reply) => {
        const { sub: userId } = request.user;
        const paramsSchema = z.object({
            id: z.string().uuid(),
          })
      
          const { id } = paramsSchema.parse(request.params)
      
        const bodySchema = z.object({
            userName: z.string()
        })
        const { userName } = bodySchema.parse(request.body);

        const users = await prisma.followers.findMany({
            where: {
                followerId: id,
                user: {
                    name: {
                        contains: userName
                    }
                }
              }, select: {
                user: {
                    select: {
                        School: true,
                        name: true,
                        profilePic: true,
                        id: true,
                        Followers: {
                            select: {
                                userId: true
                            }
                        }
                    }
                }
            }
        })
        
        return users.map((user) => {
            const followedByUser = user.user.Followers.some((follower) => follower.userId === userId);
            const fullURL = request.protocol.concat('://').concat(request.hostname)
            const fileURL = new URL(user.user.profilePic, fullURL).toString()
            user.user.profilePic = fileURL

          return {
            id: user.user.id,
            profilePic: user.user.profilePic,
            name: user.user.name.length >=15 ? user.user.name.substring(0, 15).concat('...') : user.user.name,
            school: user.user.School.name.length >=15 ? user.user.School.name.substring(0, 15).concat('...') : user.user.School.name,
            followedByUser
          }
        })
    })

    app.post('/search/following/:id', async (request, reply) => {
        const { sub: userId } = request.user;
        const paramsSchema = z.object({
            id: z.string().uuid(),
          })
      
          const { id } = paramsSchema.parse(request.params)
      
        const bodySchema = z.object({
            userName: z.string()
        })
        const { userName } = bodySchema.parse(request.body);

        const users = await prisma.followers.findMany({
            where: {
                userId: id,
                user: {
                    name: {
                        contains: userName
                    }
                }
              }, select: {
                follower: {
                    select: {
                        School: true,
                        name: true,
                        profilePic: true,
                        id: true,
                        Followers: {
                            select: {
                                userId: true
                            }
                        }
                    }
                }
            }
        })
        
        return users.map((user) => {
            const followedByUser = user.follower.Followers.some((follower) => follower.userId === userId);
            const fullURL = request.protocol.concat('://').concat(request.hostname)
            const fileURL = new URL(user.follower.profilePic, fullURL).toString()
            user.follower.profilePic = fileURL

          return {
            id: user.follower.id,
            profilePic: user.follower.profilePic,
            name: user.follower.name.length >=15 ? user.follower.name.substring(0, 15).concat('...') : user.follower.name,
            school: user.follower.School.name.length >=15 ? user.follower.School.name.substring(0, 15).concat('...') : user.follower.School.name,
            followedByUser
          }
        })
    })
}