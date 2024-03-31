import { QueryRunner } from "typeorm";
import { Tutor } from "../entity/Tutor";
import { hashPassword } from "../utils/auth";

export async function crearTutor(body: any, queryRunner: QueryRunner): Promise<Tutor> {
    const tutor = new Tutor();
    tutor.email = body.email;
    tutor.password = await hashPassword(body.password);
    tutor.telefono = body.telefono;
    console.log(tutor.telefono);
    tutor.nombre = body.nombre;
    tutor.apellido = body.apellido;
    tutor.imagen = body.imagen || "";
    tutor.alias = body.alias;
    tutor.mascotas = [];
    return await queryRunner.manager.save(tutor);
}