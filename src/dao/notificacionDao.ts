import { QueryRunner } from "typeorm";
import { Demanda } from "../entity/Demanda";
import { Notificacion } from "../entity/Notificacion";

export async function crearNotificacion(descripcion: string, demanda: Demanda, queryRunner: QueryRunner): Promise<Notificacion | null> {

    const notificacion = new Notificacion()
    notificacion.fechaCreacion = new Date()
    notificacion.estado = "Nueva"
    notificacion.descrpcion = descripcion
    notificacion.demanda = demanda

    return queryRunner.manager.save(notificacion)
}