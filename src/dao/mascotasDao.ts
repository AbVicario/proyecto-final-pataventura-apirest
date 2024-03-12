
import { Mascota } from "../entity/Mascota";
import { Tutor } from "../entity/Tutor";

export async function crearMascota(body: any, tutor: Tutor): Promise<Mascota> {
    
        const mascota = new Mascota()
        mascota.nombre = body.nombre;
        mascota.num_chip = body.num_chip; 
        mascota.edad = body.edad || 0;
        mascota.imagen = body.imagen || "";
        mascota.tamanyo = body.tamanyo || 0;
        mascota.peso = body.peso || 0;
        mascota.color = body.color;
        mascota.tipo = body.tipo;
        mascota.raza = body.raza || "";
        mascota.observacion = body.observacion || "";
        mascota.tutor = tutor;
        mascota.demandas = [];
        mascota.raza = body.raza || "";
        return await mascota.save();
}