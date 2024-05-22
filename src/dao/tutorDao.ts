import { QueryRunner } from "typeorm";
import { Tutor } from "../entity/Tutor";
import { hashPassword } from "../utils/auth";

export async function crearTutor(body: any, queryRunner: QueryRunner): Promise<Tutor> {
    const tutor = new Tutor();
    tutor.email = body.email;
    tutor.password = await hashPassword(body.password);
    tutor.telefono = body.telefono;
    tutor.nombre = body.nombre;
    tutor.apellido = body.apellido;
    if (body.imagen && Array.isArray(body.imagen)) {
        try {
            tutor.imagen = Buffer.from(body.imagen);
        } catch (error) {
            console.error("Error al convertir los datos de la imagen a Buffer:", error);
            tutor.imagen = null;
        }
    } else {
        tutor.imagen = null;
    }
    tutor.alias = body.alias;
    tutor.direccion = body.direccion
    tutor.mascotas = [];
    return await queryRunner.manager.save(tutor);
}