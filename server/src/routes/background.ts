import { FastifyInstance } from "fastify";
import fs from 'node:fs';
import path from 'node:path';

export async function backgroundsRoutes(app: FastifyInstance) {
    app.get('/background', async (request, reply) => {
        const folderPath = path.join(__dirname, '..', '..', 'uploads', 'backgroundImages');
        const files = fs.readdirSync(folderPath);
        const randomIndex = Math.floor(Math.random() * files.length);
        const randomImage = files[randomIndex];
        const fullURL = request.protocol.concat('://').concat(process.env.CURRENT_URL ?? '').concat('/uploads/backgroundImages/')
        const fileURL = new URL(randomImage, fullURL).toString()
        
        return {backgroundImage: fileURL}
    });
}