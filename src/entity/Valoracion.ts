
import { IsNumber, Max, Min } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, OneToOne, JoinColumn } from "typeorm"
import { Demanda } from "./Demanda"

@Entity()
export class Valoracion extends BaseEntity {

    @PrimaryGeneratedColumn()
    id_valoracion: number

    @Column()
    @IsNumber({}, { message: "El campo puntuacion debe ser un numero valido" })
    @Min(1, { message: "La valoración debe ser como mínimo 1" })
    @Max(5, { message: "La valoración debe ser como máximo 5" })
    puntuacion: number

    @Column({ nullable: true })
    descripcion: string

    @OneToOne(() => Demanda)
    @JoinColumn()
    demanda: Demanda
}