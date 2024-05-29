import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Demanda } from "./Demanda";

@Entity()
export class Notificacion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_alerta: number

    @Column()
    fechaCreacion: Date

    @Column()
    estado: string

    @Column({ nullable: true })
    descripcion: string

    @Column({ nullable: true })
    destinatario: string

    @ManyToOne(() => Demanda, demanda => demanda.notificaciones)
    @JoinColumn()
    demanda: Demanda

}




