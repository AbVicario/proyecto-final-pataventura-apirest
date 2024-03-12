import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cuidador } from "./Cuidador";
import { Mascota } from "./Mascota";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";


@Entity()
export class Demanda extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_demanda: number

    @Column()
    @IsDate({ message: "La fecha de inicio debe tener un formato válido" })
    fechaInicio: Date

    @Column()
    @IsDate({ message: "La fecha de fin debe tener un formato válido" })
    fechaFin: Date

    @Column('numeric')
    @IsNumber({},{message: "Debe incluir un precio valido"})
    precio: number

    @Column()
    @IsNotEmpty({message: "La descripción no puede ser un campo vacio"})
    descripcion: string

    @Column()
    @IsNotEmpty({message: "El estado no puede ser un campo vacio"})
    estado: string

    @ManyToOne(() => Cuidador, cuidador => cuidador.demandas, {nullable: true} )
    cuidador: Cuidador;

    @ManyToOne(() => Mascota, mascota => mascota.demandas)
    mascota: Mascota;
}