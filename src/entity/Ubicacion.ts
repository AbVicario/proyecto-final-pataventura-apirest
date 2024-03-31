import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Tutor } from "./Tutor";
import { Cuidador } from "./Cuidador";


@Entity()
export class Ubicacion extends BaseEntity {

    @PrimaryGeneratedColumn()
    id_ubicacion: number

    @Column('point')
    coordenadas: string;

    @OneToOne(() => Tutor)
    @JoinColumn()
    tutor: Tutor

    @OneToOne(() => Cuidador)
    @JoinColumn()
    cuidador: Cuidador
}