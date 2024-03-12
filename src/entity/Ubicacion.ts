import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { IsNumber} from "class-validator";
import { Tutor } from "./Tutor";
import { Cuidador } from "./Cuidador";
import { Cliente } from "./Cliente";

@Entity()
export class Ubicacion extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_ubicacion:number

    @Column('point')
    coordenadas: string;

    @ManyToOne(() => Tutor, tutor => tutor.direcciones, { nullable: true })
    tutor: Tutor;

    @ManyToOne(() => Cuidador, cuidador => cuidador.direcciones, { nullable: true })
    cuidador: Cuidador;
}