import { Cuidador } from "../entity/Cuidador";
import { Oferta } from "../entity/Oferta";

export async function crearOferta(body: any, cuidador: Cuidador): Promise<void> {
    const oferta = new Oferta();
    oferta.tipo = body.tipoOferta;
    oferta.descripcion = body.descripcion;
    oferta.precio = body.precio;
    oferta.cuidador = cuidador;
    await Oferta.save(oferta);
}