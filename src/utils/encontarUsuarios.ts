
import { Cuidador } from "../entity/Cuidador";
import { Ubicacion } from "../entity/Ubicacion";
import { calcularDistancia } from "./calcularDistancia";


export async function encontrarUsuariosCercanos(ubicaciones: Ubicacion[], radio: number, coordenada: string): Promise<Cuidador[]> {
    const usuariosCercanos: Cuidador[] = [];
    const coordenadas = coordenada.split(',')
    for (const ubicacion of ubicaciones) {
        const coordenadasCui = ubicacion.coordenadas.split(',')
        const distancia = calcularDistancia(ubicacion[0], ubicacion[1], parseFloat(coordenadas[0]), parseFloat(coordenadas[1]));
        if (await distancia <= radio) {
            usuariosCercanos.push(ubicacion.cuidador);
        }


    }
    return usuariosCercanos;
}