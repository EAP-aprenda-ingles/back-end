import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import 'dotenv/config'
import fastify from 'fastify'
import { resolve } from 'node:path'
import { actionsRoutes } from './routes/actions'
import { articlesRoutes } from './routes/article'
import { authRoutes } from './routes/authentication'
import { commentsRoutes } from './routes/comments'
import { followRoutes } from './routes/follow'
import { followRequestsRoutes } from './routes/followRequests'
import { likesRoutes } from './routes/likes'
import { notificationRoutes } from './routes/notifications'
import { preferencesRoutes } from './routes/preferences'
import { saveOnFeedRoutes } from './routes/saveOnFeed'
import { schoolRoutes } from './routes/schools'
import { searchRoutes } from './routes/search'
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
app.register(followRoutes);
app.register(likesRoutes);
app.register(commentsRoutes);
app.register(actionsRoutes);
app.register(saveOnFeedRoutes);
app.register(followRequestsRoutes);
app.register(notificationRoutes);
app.register(searchRoutes);

app.listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('running server on http://localhost:3333')
  })
  .catch((err) => console.error(err))