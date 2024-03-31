import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tipo extends BaseEntity {

    @PrimaryGeneratedColumn()
    id_tipo: number

    @Column()
    @IsNotEmpty({ message: 'El tipo no puede estar en blanco' })
    tipo_animal: string

    @Column()
    @IsNotEmpty({ message: 'La raza no puede estar en blanco' })
    raza: string

}
