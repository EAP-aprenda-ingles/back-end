import { PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export async function followRequestsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request: FastifyRequest) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            app.log.error(error);
            throw new Error("Authentication failed");
        }
    });

    app.get('/followRequests', async (request, reply) => {
        try {
            const { sub: userId } = request.user as { sub: string };
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
            const { sub: userId } = request.user as { sub: string };

            const bodySchema = z.object({
                followeeId: z.string().uuid(),
            });

            const { followeeId } = bodySchema.parse(request.body);

            // Check if follow request exists
            const followRequestExists = await prisma.followRequests.findFirst({
                where: { userId, followerId: followeeId },
                select: { follower: { select: { id: true, name: true } } },
            });

            // Create or delete follow request
            if (followRequestExists) {
                await prisma.followRequests.delete({
                    where: { id: followRequestExists.follower.id },
                });
            } else {
                await prisma.followRequests.create({
                    data: { userId, followerId: followeeId },
                });
            }

            const followee = await prisma.users.findUniqueOrThrow({
                where: { id: followeeId },
            });

            return followee;
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

            // Update follow request to accepted
            const followRequest = await prisma.followRequests.update({
                where: { id: requestId },
                data: { accepted: true },
            });

            // Create follower entry
            await prisma.followers.create({
                data: { userId, followerId: followRequest.followerId },
            });

            // Create notification for follow request accepted
            const user = await prisma.users.findUnique({
                where: { id: followRequest.userId },
                select: { name: true },
            });

            await prisma.notifications.create({
                data: {
                    userId: followRequest.followerId,
                    content: `${user?.name} aceitou seu pedido de seguir`,
                    type: 'followRequestAccepted',
                },
            });

            // Soft delete the notification
            await prisma.notifications.update({
                where: { id: notificationId },
                data: { deletedAt: new Date() },
            });

            return followRequest;
        } catch (error) {
            reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
