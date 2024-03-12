import { Gato } from "../entity/Gato";
import { Mascota } from "../entity/Mascota";
import { Perro } from "../entity/Perro";
import { Tutor } from "../entity/Tutor";

export async function crearMascota(body: any, tutor: Tutor): Promise<Mascota | null> {
    if (body.tipo === "Perro" || body.tipo === "Gato") {
        const mascota = body.tipo === "Perro" ? new Perro() : new Gato();
        mascota.nombre = body.nombre_mascota;
        mascota.edad = body.edad || 0;
        mascota.imagen = body.imagen_mascota || "";
        mascota.tamanyo = body.tamanyo || 0;
        mascota.peso = body.peso || 0;
        mascota.color = body.color;
        mascota.tipo = body.tipo;
        mascota.observacion = body.observacion || "";
        mascota.tutor = tutor;
        mascota.demandas = [];
        mascota.raza = body.raza || "";
        return await mascota.save();
    }
    return null;
}