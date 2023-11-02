import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload/file', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5MB
      },
    })
    if (!upload) {
      return reply.status(400).send()
    }
    const mimeTypeRegex = /^application\/pdf$/;

    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)
    if (!isValidFileFormat) {
      return reply.status(400).send()
    }
    const fileID = randomUUID()
    const extension = extname(upload.filename)

    const fileName = fileID.concat(extension)
    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/files/', fileName),
    )

    await pump(upload.file, writeStream)

    const fullURL = request.protocol.concat('://').concat(request.hostname)
    const fileURL = new URL(`/uploads/files/${fileName}`, fullURL).toString()

    return { fileURL }
  })

  app.post('/upload/profilePics', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5MB
      },
    })
    if (!upload) {
      return reply.status(400).send()
    }
    const mimeTypeRegex = /^(image)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)
    if (!isValidFileFormat) {
      return reply.status(400).send()
    }
    const fileID = randomUUID()
    const extension = extname(upload.filename)

    const fileName = fileID.concat(extension)
    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/profilePics/', fileName),
    )

    await pump(upload.file, writeStream)

    const fullURL = request.protocol.concat('://').concat(request.hostname)
    const fileURL = new URL(`/uploads/profilePics/${fileName}`, fullURL).toString()

    return { fileURL }
  })
}