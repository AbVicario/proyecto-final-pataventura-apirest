import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TipoMascota extends BaseEntity {

    @PrimaryGeneratedColumn()
    id_tipoMascota: number

    @Column()
    @IsNotEmpty({ message: 'El tipo no puede estar en blanco' })
    tipo_animal: string

    @Column("simple-array")
    razas: string[];

}
