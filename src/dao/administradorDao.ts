import { QueryRunner } from "typeorm";
import { Administrador } from "../entity/Administrador";
import { hashPassword } from "../utils/auth";
import { TipoMascota } from "../entity/TipoMascota";
import { TipoOferta } from "../entity/TipoOferta";

export async function crearAdmin(body: any, queryRunner: QueryRunner): Promise<Administrador> {
    const tutor = new Administrador();
    tutor.email = body.email;
    tutor.password = await hashPassword(body.password);
    return await queryRunner.manager.save(tutor);
}


export async function crearTipoMascota(body: any, queryRunner: QueryRunner): Promise<TipoMascota> {
    const tipoMascota = new TipoMascota();
    tipoMascota.tipo_mascota = body.tipo_mascota;
    tipoMascota.razas = body.razas;
    return await queryRunner.manager.save(tipoMascota);
}

export async function crearTipoOferta(body: any, queryRunner: QueryRunner): Promise<TipoOferta> {
    const tipoOferta = new TipoOferta();
    tipoOferta.tipo_oferta = body.tipo_oferta;
    tipoOferta.kilometros = body.kilometros;
    return await queryRunner.manager.save(tipoOferta);
}