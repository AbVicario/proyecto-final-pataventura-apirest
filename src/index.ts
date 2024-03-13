import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import 'dotenv/config'
import "reflect-metadata"
import { authMiddleware } from './midelware/authMiddleware.ts'
import mascota from './routes/mascotaRoutes'
import cliente from './routes/clienteRoutes'
import { setupDataSource } from './db/connection'

(async () => {

  const dataSource = await setupDataSource();
  await dataSource.initialize();

  const app = new Hono()

  console.log(app);


  app.use(
    '/api/admin/*',
    jwt({
      secret: process.env.JWT_SECRET!!,
      cookie: 'jwt',
    })
  )

  app.use(
    '/api/*',
    cors({
      origin: '*',
      allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
      credentials: true,
    })
  )

  app.use('/api/cliente/*', authMiddleware)
  app.route('/', cliente)
  app.route('/api/cliente/mascota', mascota)

  const port = parseInt(process.env.PORT) || 8000
  console.log(`Server is running on  ${port}`)

  serve({
    fetch: app.fetch,
    port,
  })
  console.log(`API URL => http://localhost:${port}`)

})()
