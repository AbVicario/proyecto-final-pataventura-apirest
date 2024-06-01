import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TipoMascota extends BaseEntity {

    @PrimaryGeneratedColumn()
    id_tipoMascota: number

    @Column({ unique: true })
    @IsNotEmpty({ message: 'El tipo no puede estar en blanco' })
    tipo_mascota: string

    @Column("simple-array")
    razas: string[];

}
