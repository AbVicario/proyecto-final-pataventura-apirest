import { Entity, Column, OneToMany, PrimaryGeneratedColumn, Unique, BaseEntity, ChildEntity, TableInheritance } from "typeorm"
import { Usuario } from "./Usuario"
import { IsNotEmpty} from "class-validator"


export class Cliente {

    /*@PrimaryGeneratedColumn()
    id_cliente: number*/

    @Column(() => Usuario)
    usuario: Usuario;

    @Column()
    @IsNotEmpty({ message: 'El teléfono no puede estar en blanco'})
    telefono: string

    @Column()
    @IsNotEmpty({ message: 'El nombre no puede estar en blanco'})
    nombre: string

    @Column()
    @IsNotEmpty({ message: 'El apellido no puede estar en blanco'})
    apellido: string
    
    @Column({nullable: true})
    imagen: string

    @Column({unique: true})
    @IsNotEmpty({ message: 'El alias no puede estar en blanco' })
    //@Unique(" El alias ya se esta utilizando", ["alias"])
    alias: string

   

}