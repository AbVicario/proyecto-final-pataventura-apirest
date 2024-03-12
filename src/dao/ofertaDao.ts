import { Cuidador } from "../entity/Cuidador";
import { Oferta } from "../entity/Oferta";

export async function crearOferta(body: any, cuidador: Cuidador): Promise<Oferta | null> {
    const oferta = new Oferta();
    oferta.tipo = body.tipoOferta;
    oferta.descripcion = body.descripcion;
    oferta.precio = body.precio;
    oferta.cuidador = cuidador;
    return await Oferta.save(oferta);
}