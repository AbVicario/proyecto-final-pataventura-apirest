
import { Ubicacion } from "../entity/Ubicacion";
import { Tutor } from "../entity/Tutor";
import { Cuidador } from "../entity/Cuidador";
import { QueryRunner } from "typeorm";

export async function crearUbicacionTutor(body: any, tutor: Tutor, queryRunner: QueryRunner): Promise<Ubicacion | null> {
    const direccion = new Ubicacion();
    direccion.tutor = tutor;
    direccion.coordenadas = body.coordenadas
    return await queryRunner.manager.save(direccion);
}

export async function crearUbicacionCuidador(body: any, cuidador: Cuidador, queryRunner: QueryRunner): Promise<Ubicacion | null> {
    const direccion = new Ubicacion();
    direccion.cuidador = cuidador;
    direccion.coordenadas = body.coordenadas
    return await queryRunner.manager.save(direccion);
}