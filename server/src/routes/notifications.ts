import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function notificationRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
   })

    app.get('/notifications', async (request, reply) => {
         const { sub: userId } = request.user;
    
         const notifications = await prisma.notifications.findMany({
              where: {
                userId,
                deletedAt: null
              },
              orderBy: {
                happenedAt: 'desc'
              }
         })
    
         return notifications
    })

    app.get('/notificationsLength', async (request, reply) => {
        const { sub: userId } = request.user;

        const notifications = await prisma.notifications.findMany({
            where: {
              userId,
              deletedAt: null
            }
       })

        return notifications.length
    })

    app.put('/notifications', async (request, reply) => {
        const { sub: userId } = request.user;

        const bodySchema = z.object({
            notificationId: z.number(),
          })
      
          const { notificationId } = bodySchema.parse(request.body)
      

        const notifications = await prisma.notifications.updateMany({
            where: {
              id: notificationId,
            },
            data: {
                deletedAt: new Date()
            }
       })

        return notifications
    }
    )
}