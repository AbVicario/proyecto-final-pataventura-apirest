import { QueryRunner } from "typeorm";
import { Cuidador } from "../entity/Cuidador";
import { Demanda } from "../entity/Demanda";
import { Mascota } from "../entity/Mascota";

export async function crearDemanda(body: any, mascota: Mascota, cuidador: Cuidador, queryRunner: QueryRunner): Promise<Demanda | null> {
    const demanda = new Demanda()
    demanda.fechaInicio = body.fechaInicio
    demanda.fechaFin = body.fechaFin
    demanda.precio = body.precio
    demanda.descripcion = body.descripcion
    demanda.estado = body.estado
    demanda.cuidador = cuidador
    demanda.mascota = mascota;
    return queryRunner.manager.save(demanda)
}