import { BaseEntity, ChildEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "./Cliente";
import { Demanda } from "./Demanda";
import { Oferta } from "./Oferta";

@Entity()
export class Cuidador extends Cliente {

    @OneToMany(() => Oferta, oferta => oferta.cuidador, { nullable: true })
    ofertas: Oferta[];
} 