import { BaseEntity, ChildEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "./Cliente";
import { Demanda } from "./Demanda";
import { Oferta } from "./Oferta";
import { Ubicacion } from "./Ubicacion";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Cuidador extends Cliente {

    @OneToMany(() => Demanda, demanda => demanda.cuidador)
    demandas: Demanda[];

    @OneToMany(() => Oferta, oferta => oferta.cuidador)
    ofertas: Oferta[];

    @OneToMany(() => Ubicacion, ubicacion => ubicacion.cuidador)
    @IsNotEmpty({ message: 'La direccion  no puede estar en blanco' })
    direcciones: Ubicacion[]

} 