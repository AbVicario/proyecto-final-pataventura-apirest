import { BaseEntity, Column, Entity } from "typeorm";
import { Usuario } from "./Usuario";

@Entity()
export class Administrador extends BaseEntity{

    @Column(() => Usuario)
    usuario: Usuario;
}
