import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import 'dotenv/config';
import "reflect-metadata";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import mascota from './routes/mascotaRoutes';
import tipoAdmin from './routes/tipoAdminRoutes';
import tipoCliente from './routes/tipoClienteRoutes';
import cliente from './routes/clienteRoutes';
import valoracion from './routes/valoracionRoutes';
import demanda from './routes/demandaRoutes';
import oferta from './routes/ofertaRoutes';
import ubicacion from './routes/ubicacionRoutes';
import notificacion from './routes/notificacionRoutes';
import { setupDataSource } from './db/connection';
import { authMiddleware } from './middelware/authMiddleware.ts';
import adminRoutes from './routes/adminRoutes';






export let dataSource;

export async function createApp(): Promise<OpenAPIHono> {
  let app = new OpenAPIHono();

  app.get(
    "/docs",
    swaggerUI({
      url: "/doc",
    })
  );

  // declareRoutes(app);

  app.doc("/doc", {
    info: {
      title: "An API",
      version: "v1",
    },
    openapi: "3.1.0",
  });

  return app;
}

(async () => {
  dataSource = await setupDataSource();
  await dataSource.initialize();
  const app = new Hono()

  app.use(
    '/api/*',
    cors({
      origin: '*',
      allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
      credentials: true,
    })
  )

  /*app.use(
    '/api/admin/*',
    jwt({
      secret: process.env.JWT_SECRET!!,
      cookie: 'jwt',
    })
  )*/

  //const app = await createApp();

  app.use('/api/*', authMiddleware);
  app.route('/api/cliente', cliente);
  app.route('/', cliente);
  app.route('/', adminRoutes);
  app.route('/api/admin', adminRoutes);
  app.route('/api/admin/tipo', tipoAdmin);
  app.route('/api/cliente/mascota', mascota);
  app.route('/api/cliente/tipo', tipoCliente);
  app.route('/api/cliente/valoracion', valoracion);
  app.route('/api/cliente/demanda', demanda);
  app.route('/api/cliente/oferta', oferta);
  app.route('/api/cliente/ubicacion', ubicacion);
  app.route('/api/cliente/notificacion', notificacion);

  const port = parseInt(process.env.PORT) || 8000;
  console.log(`Server is running on  ${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
  console.log(`API URL => http://localhost:${port}`);
})();