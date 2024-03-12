
import { IsNumber, Max, Min } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Cuidador } from "./Cuidador"
import { Tutor } from "./Tutor"

@Entity()
export class Valoracion{

    @PrimaryGeneratedColumn()
    id_valoracion: number

    @Column()
    @IsNumber({}, {message: "El campo puntuacion debe ser un numero valido"})
    @Min(1, { message: "La valoración debe ser como mínimo 1" })
    @Max(5, { message: "La valoración debe ser como máximo 5" })
    puntuacion: number

    @Column({nullable: true})
    descripcion: string

    @ManyToOne(() => Cuidador, cuidador => cuidador.valoraciones, {nullable: true} )
    cuidador: Cuidador;

    @ManyToOne(() => Tutor, tutor => tutor.valoraciones)
    tutor: Tutor;
}