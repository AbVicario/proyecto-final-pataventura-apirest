import { Column, Entity } from "typeorm";
import { Mascota } from "./Mascota";

@Entity()
export class Gato extends Mascota {
    
    @Column({nullable: true})
    raza: string
}