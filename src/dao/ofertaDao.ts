import { Query } from "pg";
import { Cuidador } from "../entity/Cuidador";
import { Oferta } from "../entity/Oferta";
import { QueryRunner } from "typeorm";

export async function crearOferta(body: any, cuidador: Cuidador, queryRunner: QueryRunner): Promise<Oferta | null> {
    const oferta = new Oferta();
    oferta.tipo = body.tipo;
    oferta.descripcion = body.descripcion;
    oferta.precio = body.precio;
    oferta.radio = body.radio;
    oferta.cuidador = cuidador;
    return await queryRunner.manager.save(oferta);
}