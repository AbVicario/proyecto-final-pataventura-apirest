import { QueryRunner } from "typeorm";
import { Demanda } from "../entity/Demanda";
import { Mascota } from "../entity/Mascota";
import { Oferta } from "../entity/Oferta";

export async function crearDemanda(body: any, mascota: Mascota, oferta: Oferta, queryRunner: QueryRunner): Promise<Demanda | null> {
    const demanda = new Demanda()
    demanda.fechaInicio = body.fechaInicio
    demanda.fechaFin = body.fechaFin
    demanda.descripcion = body.descripcion
    demanda.estado = "Pendiente"
    demanda.oferta = oferta
    demanda.mascota = mascota;
    return queryRunner.manager.save(demanda)
}