import { QueryRunner } from "typeorm";
import { Administrador } from "../entity/Administrador";
import { hashPassword } from "../utils/auth";

export async function crearAdmin(body: any, queryRunner: QueryRunner): Promise<Administrador> {
    const tutor = new Administrador();
    tutor.email = body.email;
    tutor.password = await hashPassword(body.password);
    return await queryRunner.manager.save(tutor);
}