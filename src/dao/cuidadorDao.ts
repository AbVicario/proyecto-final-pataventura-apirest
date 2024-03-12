import { Cuidador } from "../entity/Cuidador";
import { hashPassword } from "../utils/auth";

export async function crearCuidador(body: any): Promise<Cuidador> {
    const cuidador = new Cuidador();
    cuidador.email = body.email;
    cuidador.password = await hashPassword(body.password);
    cuidador.telefono = body.telefono;
    cuidador.nombre = body.nombre;
    cuidador.apellido = body.apellido;
    cuidador.imagen = body.imagen || "";
    cuidador.alias = body.alias;
    cuidador.direcciones = []; 
    cuidador.ofertas = [];
    cuidador.demandas = [];
    cuidador.valoraciones = [];
    return await Cuidador.save(cuidador);
}