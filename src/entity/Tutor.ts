import { Entity, OneToMany } from "typeorm"
import { Cliente } from "./Cliente";
import { Mascota } from "./Mascota";
import { nullable } from "zod";



@Entity()
export class Tutor extends Cliente {

    @OneToMany(() => Mascota, mascota => mascota.tutor, { nullable: true })
    mascotas: Mascota[]
}