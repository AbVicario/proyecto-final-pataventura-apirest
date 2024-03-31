import { QueryRunner } from "typeorm";
import { Tipo } from "../entity/Tipo";

export async function crearTipoDao(body: any, queryRunner: QueryRunner): Promise<Tipo> {
    const tipo = new Tipo();
    tipo.tipo_animal = body.tipo;
    tipo.raza = body.raza;
    return await queryRunner.manager.save(tipo);
}