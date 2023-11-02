import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function preferencesRoutes(app: FastifyInstance) {
    app.get('/preferences', async (request, reply) => {
        const preferences = await prisma.preferences.findMany()
        if (!preferences) {
            reply.send('Erro ao requisitar as preferências. Contate um desenvolvedor!').status(409)
        }
        return preferences
    })
}