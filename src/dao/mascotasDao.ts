
import { QueryRunner } from "typeorm";
import { Mascota } from "../entity/Mascota";
import { Tutor } from "../entity/Tutor";

export async function crearMascota(body: any, tutor: Tutor, queryRunner: QueryRunner): Promise<Mascota> {

        const mascota = new Mascota()
        mascota.nombre = body.nombre;
        mascota.num_chip = body.num_chip;
        mascota.edad = body.edad || 0;
        if (body.imagen && Array.isArray(body.imagen)) {
                try {
                        mascota.imagen = Buffer.from(body.imagen);
                } catch (error) {
                        console.error("Error al convertir los datos de la imagen a Buffer:", error);
                        mascota.imagen = null;
                }
        } else {
                mascota.imagen = null;
        }
        mascota.tamanyo = body.tamanyo || "";
        mascota.peso = body.peso || 0;
        mascota.color = body.color;
        mascota.tipo = body.tipo;
        mascota.raza = body.raza || "";
        mascota.observacion = body.observacion || "";
        mascota.tutor = tutor;
        mascota.demandas = [];
        mascota.raza = body.raza || "";
        mascota.sexo = body.sexo || "";
        return await queryRunner.manager.save(mascota);
}