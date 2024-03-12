import { Entity, PrimaryGeneratedColumn, OneToMany, ChildEntity, BaseEntity, Column} from "typeorm"
import { Cliente } from "./Cliente";
import { Mascota } from "./Mascota";
import { Valoracion } from "./Valoracion";
import { Ubicacion } from "./Ubicacion";
import { IsNotEmpty } from "class-validator";


@Entity()
export class Tutor extends Cliente {

    @OneToMany(() => Mascota, mascota => mascota.tutor)
    mascotas: Mascota[]

    @OneToMany(() => Valoracion, valoracion => valoracion.tutor)
    valoraciones: Valoracion[]

    @OneToMany(type => Ubicacion, ubicacion => ubicacion.tutor, {cascade: true})
    @IsNotEmpty({ message: 'La direccion  no puede estar en blanco'})
    direcciones:Ubicacion[]
}