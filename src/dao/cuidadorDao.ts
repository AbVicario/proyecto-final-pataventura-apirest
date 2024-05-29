import { QueryRunner } from "typeorm";
import { Cuidador } from "../entity/Cuidador";
import { hashPassword } from "../utils/auth";

export async function crearCuidador(body: any, queryRunner: QueryRunner): Promise<Cuidador> {
    const cuidador = new Cuidador();
    cuidador.email = body.email;
    cuidador.password = await hashPassword(body.password);
    cuidador.telefono = body.telefono;
    cuidador.nombre = body.nombre;
    cuidador.apellido = body.apellido;
    if (body.imagen && Array.isArray(body.imagen)) {
        try {
            cuidador.imagen = Buffer.from(body.imagen);
        } catch (error) {
            console.error("Error al convertir los datos de la imagen a Buffer:", error);
            cuidador.imagen = null;
        }
    } else {
        cuidador.imagen = null;
    }
    cuidador.alias = body.alias;
    cuidador.ofertas = [];
    cuidador.direccion = body.direccion
    return await queryRunner.manager.save(cuidador);
}