import { Tutor } from "../entity/Tutor";
import { Ubicacion } from "../entity/Ubicacion";

export async function crearUbicacion(body: any, tutor: Tutor): Promise< Ubicacion | null> {
    const direccion = new Ubicacion();
    direccion.tutor = tutor;
    direccion.coordenadas=body.coordenadas
    return await Ubicacion.save(direccion);
}