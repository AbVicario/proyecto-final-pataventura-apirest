import { QueryRunner } from "typeorm";
import { Demanda } from "../entity/Demanda";
import { Notificacion } from "../entity/Notificacion";

export async function crearNotificacion(body: any, demanda: Demanda, queryRunner: QueryRunner): Promise<Notificacion | null> {

    const notificacion = new Notificacion()
    notificacion.fechaCreacion = body.fechaCreacion
    notificacion.estado = body.estado
    notificacion.descrpcion = body.descripcion
    notificacion.demanda = demanda

    return queryRunner.manager.save(notificacion)
}