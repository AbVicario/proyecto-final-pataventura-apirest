import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import 'dotenv/config'
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Usuario } from "./entity/Usuario"
import { Administrador } from "./entity/Administrador"
import { Cliente } from "./entity/Cliente"
import { Valoracion } from "./entity/Valoracion"
import { Mascota } from "./entity/Mascota"
import { Contrato } from "./entity/Contrato"
import { Gato } from "./entity/Gato"
import { Perro } from "./entity/Perro"
import { Demanda} from "./entity/Demanda"
import { Oferta } from "./entity/Oferta"
import { Tutor } from "./entity/Tutor"
import { Ubicacion } from "./entity/Ubicacion"
import { Cuidador } from './entity/Cuidador'
import { authMiddleware } from './midelware/authMiddleware.ts'
import mascota from './routes/mascota'
import cliente from './routes/cliente'

(async () => {

  const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "pataventura",
    synchronize: true,
    logging: false,
    entities: [Usuario, Administrador, Cliente, Valoracion, Mascota, Contrato, Gato, Perro, Demanda,
     Oferta, Cuidador, Tutor, Ubicacion],
    migrations: [],
    subscribers: [],
  });
  await AppDataSource.initialize()

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

  app.use('/cliente/*', authMiddleware) 
  app.route('/registro', cliente)
  app.route('/api/cliente', cliente)
  app.route('/cliente/tutor/mascota', mascota)


  const port = parseInt(process.env.PORT) || 8000
  console.log(`Server is running on  ${port}`)

  serve({
    fetch: app.fetch,
    port,
  })
  console.log(`API URL => http://localhost:${port}`)

})()
