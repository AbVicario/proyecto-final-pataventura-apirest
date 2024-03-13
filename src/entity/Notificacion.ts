import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Demanda } from "./Demanda";

@Entity()
export class Notificacion {
    @PrimaryGeneratedColumn()
    id_alerta: number

    @Column()
    fechaCreacion: Date

    @Column()
    estado: string

    @Column()
    descrpcion: string

    @OneToOne(() => Demanda)
    @JoinColumn()
    demanda: Demanda

}




