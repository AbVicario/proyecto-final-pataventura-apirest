

import 'dotenv/config'
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Usuario } from '../entity/Usuario';
import { Administrador } from '../entity/Administrador';
import { Cliente } from '../entity/Cliente';
import { Valoracion } from '../entity/Valoracion';
import { Mascota } from '../entity/Mascota';
import { Contrato } from '../entity/Contrato';
import { Demanda } from '../entity/Demanda';
import { Ubicacion } from '../entity/Ubicacion';
import { Tutor } from '../entity/Tutor';
import { Cuidador } from '../entity/Cuidador';
import { Oferta } from '../entity/Oferta';
import { Notificacion } from '../entity/Notificacion';
import { TipoMascota } from '../entity/TipoMascota';
import { TipoOferta } from '../entity/TipoOferta';

export async function setupDataSource(): Promise<DataSource> {
    return new DataSource({
        type: "postgres",
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: "pataventura",
        synchronize: true,
        logging: false,
        entities: [Usuario, Administrador, Cliente, Valoracion, Mascota, Contrato, Demanda, Notificacion,
            Oferta, Cuidador, Tutor, Ubicacion, TipoMascota, TipoOferta],
        migrations: [],
        subscribers: [],
        ssl: true
    });
}

