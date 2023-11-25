import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import 'dotenv/config'
import fastify from 'fastify'
import { resolve } from 'node:path'
import { articlesRoutes } from './routes/article'
import { authRoutes } from './routes/authentication'
import { preferencesRoutes } from './routes/preferences'
import { schoolRoutes } from './routes/schools'
import { uploadRoutes } from './routes/upload'
import { userRoutes } from './routes/users'

const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: 'eapbackend',
})
app.register(multipart)
app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(schoolRoutes);
app.register(preferencesRoutes);
app.register(uploadRoutes);
app.register(authRoutes);
app.register(articlesRoutes);
app.register(userRoutes);

app.listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('running server on http://localhost:3333')
  })
  .catch((err) => console.error(err))