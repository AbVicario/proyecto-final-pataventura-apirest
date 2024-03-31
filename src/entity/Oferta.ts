import { IsNotEmpty, IsNumber } from "class-validator";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cuidador } from "./Cuidador";

@Entity()
export class Oferta extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_oferta: number

    @Column()
    @IsNotEmpty({ message: "Debe establecer el tipo de la oferta" })
    tipo: string

    @Column()
    @IsNotEmpty({ message: "Debe establecer una descripcion a la oferta" })
    descripcion: string

    @Column()
    @IsNotEmpty({ message: "Debe establecer una distancia máxima a la que trabajar" })
    radio: number

    @Column('numeric')
    @IsNumber({}, { message: "Debe establecer un precio a la oferta" })
    precio: number

    @ManyToOne(() => Cuidador, cuidador => cuidador.ofertas, { nullable: true })
    cuidador: Cuidador;
}

