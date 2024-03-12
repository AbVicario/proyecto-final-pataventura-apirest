import { IsNotEmpty } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contrato{
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    texto: string
}