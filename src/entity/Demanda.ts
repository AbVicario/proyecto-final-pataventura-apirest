import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cuidador } from "./Cuidador";
import { Mascota } from "./Mascota";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";
import { Oferta } from "./Oferta";
import { nullable } from "zod";
import { Notificacion } from "./Notificacion";


@Entity()
export class Demanda extends BaseEntity {

    @PrimaryGeneratedColumn()
    id_demanda: number

    @Column()
    @IsDate({ message: "La fecha de inicio debe tener un formato válido" })
    fechaInicio: Date

    @Column()
    @IsDate({ message: "La fecha de fin debe tener un formato válido" })
    fechaFin: Date

    @Column()
    @IsNotEmpty({ message: "La descripción no puede ser un campo vacio" })
    descripcion: string

    @Column({ nullable: true })
    precio: number

    @Column()
    @IsNotEmpty({ message: "El estado no puede ser un campo vacio" })
    estado: string

    @ManyToOne(() => Oferta, oferta => oferta.demandas, { nullable: true })
    oferta: Oferta;

    @ManyToOne(() => Mascota, mascota => mascota.demandas)
    mascota: Mascota;

    @OneToMany(() => Notificacion, notificacion => notificacion.demanda, { nullable: true })
    notificaciones: Notificacion[];
}