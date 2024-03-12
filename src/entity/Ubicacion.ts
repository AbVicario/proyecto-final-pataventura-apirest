import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { IsNumber} from "class-validator";
import { Tutor } from "./Tutor";
import { Cuidador } from "./Cuidador";

@Entity()
export class Ubicacion extends BaseEntity{

    @PrimaryGeneratedColumn()
    id_ubicacion:number

    @Column('numeric')
    @IsNumber({}, {message: "El campo longitud debe ser un numero valido"})
    longitud: number

    @Column('numeric')
    @IsNumber({}, {message: "El campo latitud debe ser un numero valido"})
    latidud: number

    @ManyToOne((nullable: true) => Tutor, tutor => tutor.direcciones)
    tutor: Tutor 

    @ManyToOne((nullable: true) => Cuidador, cuidador => cuidador.direcciones)
    cuidador: Cuidador 
    
}