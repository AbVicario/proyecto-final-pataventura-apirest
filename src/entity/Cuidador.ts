import {BaseEntity, ChildEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "./Cliente";
import { Demanda } from "./Demanda";
import { Valoracion } from "./Valoracion";
import { Oferta } from "./Oferta";
import { Ubicacion } from "./Ubicacion";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Cuidador extends BaseEntity {

    @Column(() => Cliente)
    cliente: Cliente;
  
    @OneToMany(() => Demanda, demanda => demanda.cuidador)
    demandas: Demanda[];
    
    @OneToMany(() => Oferta, oferta => oferta.cuidador)
    ofertas: Oferta[];

    @OneToMany(() => Valoracion, valoracion => valoracion.cuidador)
    valoraciones: Valoracion[]

    @OneToMany(() => Ubicacion, ubicacion => ubicacion.cuidador)
    @IsNotEmpty({ message: 'La direccion  no puede estar en blanco'})
    direcciones:Ubicacion[]

} 