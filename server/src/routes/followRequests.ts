import { PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export async function followRequestsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request: FastifyRequest) => {
        await request.jwtVerify();
    });

    app.get('/followRequests', async (request, reply) => {
        try {
            const { sub: userId } = request.user;
            const followRequests = await prisma.followRequests.findMany({
                where: { userId },
            });
            return followRequests;
        } catch (error) {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    app.post('/followRequests', async (request, reply) => {
        try {
            const { sub: userId } = request.user;

            const bodySchema = z.object({
                followeeId: z.string().uuid(),
            });

            const { followeeId } = bodySchema.parse(request.body);

            // Check if follow request exists
            const followRequestExists = await prisma.followRequests.findFirst({
                where: { userId, followerId: followeeId },
                select: { follower: { select: { id: true, name: true } }, id: true },
            });

            // Create or delete follow request
            if (followRequestExists) {
                await prisma.followRequests.delete({
                    where: { id: followRequestExists.id },
                });
            } else {
                const newFollowRequest = await prisma.followRequests.create({
                    data: { userId, followerId: followeeId },
                    select: {
                        user: {
                            select: { id: true, name: true },
                        },
                        id: true,
                    }
                });

                await prisma.notifications.create({
                    data: {
                        userId: followeeId,
                        content: `${newFollowRequest.user.name} deseja seguir você`,
                        type: 'followRequest',
                        followReqId: newFollowRequest.id,
                    },
                });
            }

            const followee = await prisma.users.findUniqueOrThrow({
                where: { id: followeeId },
            });

            return {followee};
        } catch (error) {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    app.post('/followRequests/accept', async (request, reply) => {
        try {
            const { sub: userId } = request.user;

            const bodySchema = z.object({
                requestId: z.number(),
                notificationId: z.number(),
            });

            const { requestId, notificationId } = bodySchema.parse(request.body);

            const followRequest = await prisma.followRequests.update({
                where: { id: requestId },
                data: { accepted: true },
            });

            await prisma.followers.create({
                data: { userId: followRequest.userId, followerId: userId },
            });

            const user = await prisma.users.findUnique({
                where: { id: followRequest.followerId },
                select: { name: true },
            });

            await prisma.notifications.create({
                data: {
                    userId: followRequest.userId,
                    content: `${user?.name} aceitou seu pedido de seguir`,
                    type: 'followRequestAccepted',
                },
            });

            await prisma.notifications.update({
                where: { id: notificationId },
                data: { deletedAt: new Date() },
            });

            await prisma.followRequests.delete({
                where: { id: requestId },
            });
            

            return followRequest;
        } catch (error) {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
