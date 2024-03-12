import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique } from "typeorm";
import { IsEmail, IsNotEmpty, Length } from "class-validator";


export class Usuario {

    @PrimaryGeneratedColumn()
    id_usuario: number;

    @Column({ unique: true })
    @IsNotEmpty({ message: "El email no debe estar en blanco" })
    @IsEmail({}, { message: "Debe introducir un email válido" })
    email: string;

    @Column()
    @IsNotEmpty({ message: "El password no debe estar en blanco" })
    @Length(6, 255, { message: "El tamaño del password debe ser mayor o igual a 6 caracteres" })
    password: string;
}

