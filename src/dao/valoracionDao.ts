import { QueryRunner } from "typeorm";
import { Cuidador } from "../entity/Cuidador";
import { Tutor } from "../entity/Tutor";
import { Valoracion } from "../entity/Valoracion";

export async function crearValoracion(body: any, cuidador: Cuidador, tutor: Tutor, queryRunner: QueryRunner): Promise<Valoracion | null> {
    const valoración = new Valoracion()
    valoración.puntuacion = body.puntuacion
    valoración.descripcion = body.descripcion
    valoración.cuidador = cuidador
    valoración.tutor = tutor

    return queryRunner.manager.save(valoración)
}


