import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from "typeorm"
import { Tutor } from "./Tutor"
import { Demanda} from "./Demanda"
import { IsNotEmpty } from "class-validator"
import { nullable } from "zod"



@Entity()
export class Mascota extends BaseEntity{
    @PrimaryGeneratedColumn()
    id_mascota: number

    @Column()
    @IsNotEmpty({message: "El nombre de la mascota no puede estar vacio"})
    nombre: string

    @Column({nullable: true})
    edad: number

    @Column({nullable: true})
    imagen: string

    @Column('numeric', {nullable: true})
    tamanyo: number

    @Column('numeric', {nullable: true})
    peso: number

    @Column()
    @IsNotEmpty({message: "El tipo de mascota no puede estar vacio"})
    tipo: string

    @Column()
    @IsNotEmpty({message: "El color que representa a la mascota no puede estar vacio"})
    color: string

    @Column({nullable: true})
    observacion: string

    @ManyToOne(() => Tutor, tutor => tutor.mascotas)
    tutor: Tutor;

    @OneToMany(() => Demanda, demanda => demanda.mascota)
    demandas: Demanda[];
}