import { Entity, Column } from "typeorm"
import { Usuario } from "./Usuario"
import { IsNotEmpty } from "class-validator"

@Entity()
export abstract class Cliente extends Usuario {

    @Column()
    @IsNotEmpty({ message: 'El teléfono no puede estar en blanco' })
    telefono: string

    @Column()
    @IsNotEmpty({ message: 'El nombre no puede estar en blanco' })
    nombre: string

    @Column()
    @IsNotEmpty({ message: 'El apellido no puede estar en blanco' })
    apellido: string

    @Column({ type: 'bytea', nullable: true })
    imagen: Buffer

    @Column({ unique: true })
    @IsNotEmpty({ message: 'El alias no puede estar en blanco' })
    alias: string

    @Column()
    @IsNotEmpty({ message: 'La direccion no puede estar en blanco' })
    direccion: string

}