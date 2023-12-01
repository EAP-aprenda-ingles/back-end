import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function followRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    app.post('/follow', async (request, reply) => {
        const { sub: userId } = request.user

        const bodySchema = z.object({
            toFollow: z.string(),
        })
      
        const { toFollow } = bodySchema.parse(request.body)

        const isFollowing = await prisma.followers.findFirst({
            where: {
                followerId: toFollow,
                userId
            }
        })

        if (!isFollowing) {
            const userInfo = await prisma.users.findUnique({
                where: { id: toFollow },
                select: { name: true, isPublic: true }
            })

            if (!userInfo) {
                throw new Error("User not found")
            }

            if (!userInfo.isPublic) {
                await prisma.followRequests.create({
                    data: {
                        followerId: toFollow,
                        userId
                    }
                })

                await prisma.notifications.create({
                    data: {
                        userId: toFollow,
                        content: `${userInfo.name} deseja seguir você`,                    
                        type: 'followRequest'
                    }
                })
            } else {
                await prisma.followers.create({
                    data: {
                        followerId: toFollow,
                        userId
                    }
                })
                await prisma.notifications.create({
                    data: {
                        userId: toFollow,
                        content: `${userInfo.name} começou a seguir você`,  
                        type: 'follow'                  
                    }
                })
            }

        } else {
            await prisma.followers.delete({
                where: {
                    id: isFollowing.id
                }
            })
        }

        const userFollowers = await prisma.users.findUnique({
            where: {
                id: toFollow
            },
            include: {
                Followers: {
                    select: {
                        userId: true
                    }
                }
            }
        })

        const followedByUser = userFollowers?.Followers.some((follower) => follower.userId === userId);

        return {
            followers: userFollowers?.Followers.length || 0,
            followedByUser: followedByUser || false
        }
    })
}
