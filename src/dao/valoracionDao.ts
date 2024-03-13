import { QueryRunner } from "typeorm";
import { Valoracion } from "../entity/Valoracion";
import { Demanda } from "../entity/Demanda";

export async function crearValoracion(body: any, demanda: Demanda, queryRunner: QueryRunner): Promise<Valoracion | null> {
    const valoración = new Valoracion()
    valoración.puntuacion = body.puntuacion
    valoración.descripcion = body.descripcion
    valoración.demanda = demanda

    return queryRunner.manager.save(valoración)
}


