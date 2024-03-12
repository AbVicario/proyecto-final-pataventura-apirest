
import { Ubicacion } from "../entity/Ubicacion";
import { Tutor } from "../entity/Tutor";
import { Cuidador } from "../entity/Cuidador";

export async function crearUbicacionTutor(body: any, tutor: Tutor): Promise< Ubicacion | null> {
    const direccion = new Ubicacion();
    direccion.tutor = tutor;
    direccion.coordenadas=body.coordenadas
    return await Ubicacion.save(direccion);
}

export async function crearUbicacionCuidador(body: any, cuidador: Cuidador): Promise< Ubicacion | null> {
    const direccion = new Ubicacion();
    direccion.cuidador = cuidador;
    direccion.coordenadas=body.coordenadas
    return await Ubicacion.save(direccion);
}