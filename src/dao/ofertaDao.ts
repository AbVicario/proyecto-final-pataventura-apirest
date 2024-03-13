import { Query } from "pg";
import { Cuidador } from "../entity/Cuidador";
import { Oferta } from "../entity/Oferta";
import { QueryRunner } from "typeorm";

export async function crearOferta(body: any, cuidador: Cuidador, queryRunner: QueryRunner): Promise<Oferta | null> {
    const oferta = new Oferta();
    oferta.tipo = body.tipoOferta;
    oferta.descripcion = body.descripcion;
    oferta.precio = body.precio;
    oferta.cuidador = cuidador;
    return await queryRunner.manager.save(oferta);
}