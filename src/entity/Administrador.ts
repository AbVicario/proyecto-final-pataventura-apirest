import { BaseEntity, Column, Entity } from "typeorm";
import { Usuario } from "./Usuario";

@Entity()
export class Administrador extends Usuario{

}
