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
    tipoMascota.tipo_animal = body.tipo_animal.IsNotEmpty ? body.tipo_animal.IsNotEmpty : [];
    tipoMascota.razas = [];
    return await queryRunner.manager.save(tipoMascota);
}

export async function crearTipoOferta(body: any, queryRunner: QueryRunner): Promise<TipoOferta> {
    const tipoOferta = new TipoOferta();
    tipoOferta.tipo_servicio = body.tipo_servicio.IsNotEmpty ? body.tipo_servicio.IsNotEmpty : [];
    tipoOferta.kilometros = [];
    return await queryRunner.manager.save(tipoOferta);
}