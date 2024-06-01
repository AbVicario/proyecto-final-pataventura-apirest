import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TipoOferta extends BaseEntity {

    @PrimaryGeneratedColumn()
    id_tipoOferta: number

    @Column()
    @IsNotEmpty({ message: 'El tipo no puede estar en blanco' })
    tipo_servicio: string

    @Column("simple-array")
    kilometros: string[];

}
