import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function schoolRoutes(app: FastifyInstance) {
    app.get('/schools', async (request, reply) => {
        const schools = await prisma.schools.findMany()
        if (!schools) {
            reply.send('Erro ao requisitar as universidades. Contate um desenvolvedor!').status(409)
        }
        return schools
    })
}