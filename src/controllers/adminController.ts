import { Answer } from '../models/answer'
import { verfifyPassword } from '../utils/auth'
import { sign } from 'hono/jwt'
import { setCookie } from 'hono/cookie'
import { Administrador } from '../entity/Administrador'
import { crearAdmin } from "../dao/administradorDao"
import { queryRunnerCreate } from "../db/queryRunner"
import { getManager } from 'typeorm'
import { Tutor } from '../entity/Tutor'
import { Client } from 'pg'
import { Cliente } from '../entity/Cliente'
import { Cuidador } from '../entity/Cuidador'
import { Mascota } from '../entity/Mascota'
import { Demanda } from '../entity/Demanda'
import { Valoracion } from '../entity/Valoracion'
import { Oferta } from '../entity/Oferta'


export const loginAdmin = async (c: any): Promise<Answer> => {
    const body = (await c.req.json())

    const admin = await Administrador.findOneBy({
        email: body.email
    })
    if (!admin) {
        return {
            data: 'Email no encontrado',
            status: 401,
            ok: false,
        }
    }

    const verifyPassword = await verfifyPassword(
        body.password,
        admin.password
    )
    if (!verifyPassword) {
        return {
            data: 'Invalid credentials',
            status: 422,
            ok: false,
        }
    }

    const adminAutenticado = {
        id_usuario: admin.id_usuario,
        tipo: "Administrador"
    }

    const token = await sign(adminAutenticado, process.env.JWT_SECRET!!)
    return {
        data: {
            token,
        },
        status: 200,
        ok: true,
    }
}

export const registroAdmin = async (c: any): Promise<Answer> => {

    const queryRunner = await queryRunnerCreate()

    try {
        const body = await c.req.json();
        const admin = await crearAdmin(body, queryRunner);
        await queryRunner.commitTransaction()
        return { data: admin.id_usuario, status: 200, ok: true };

    } catch (error) {
        await queryRunner.rollbackTransaction()
        return { data: error.message, status: 500, ok: false }

    } finally {
        await queryRunner.release()
    }
}


export const mostrarEstadisticas = async (c: any): Promise<Answer> => {
    const payload = await c.get('jwtPayload')

    try {

        const nClientes = await getManager()
            .createQueryBuilder(Cliente, "cliente")
            .select("COUNT(cliente.id)", "total")
            .getRawOne();

        const nTutor = await getManager()
            .createQueryBuilder(Tutor, "tutor")
            .select("COUNT(tutor.id)", "total")
            .getRawOne();

        const nPaseador = await getManager()
            .createQueryBuilder(Cuidador, "cuidador")
            .leftJoinAndSelect("cuidador.oferta", "oferta")
            .select("COUNT(cuidador.id)", "total")
            .where("oferta.tipo = :tipo", { tipo: "Paseo" })
            .getRawOne();

        const nGuardian = await getManager()
            .createQueryBuilder(Cuidador, "cuidador")
            .leftJoinAndSelect("cuidador.oferta", "oferta")
            .select("COUNT(cuidador.id)", "total")
            .where("oferta.tipo = :tipo", { tipo: "Guarderia" })
            .getRawOne();

        const nMascotas = await getManager()
            .createQueryBuilder(Mascota, "mascota")
            .select("COUNT(mascota.id)", "total")
            .getRawOne();

        const mediaMascotas = await getManager()
            .createQueryBuilder(Tutor, "tutor")
            .leftJoinAndSelect("tutor.mascotas", "mascota")
            .select("AVG(mascota_count)", "average_pets")
            .from(subQuery => {
                return subQuery
                    .select("tutor.id", "tutor_id")
                    .addSelect("COUNT(mascota.id)", "mascota_count")
                    .from(Tutor, "tutor")
                    .leftJoin("tutor.mascotas", "mascota")
                    .groupBy("tutor.id");
            }, "subQuery")
            .getRawOne();


        const nPerros = await getManager()
            .createQueryBuilder(Mascota, "mascota")
            .select("COUNT(mascota.id)", "total")
            .where("mascota.tipo = :tipo", { tipo: "Perro" })
            .getRawOne();

        const nGatos = await getManager()
            .createQueryBuilder(Mascota, "mascota")
            .select("COUNT(mascota.id)", "total")
            .where("mascota.tipo = :tipo", { tipo: "Gato" })
            .getRawOne();


        const nServicios = await getManager()
            .createQueryBuilder(Demanda, "demanda")
            .select("COUNT(demanda.id)", "total")
            .getRawOne();


        const nPaseos = await getManager()
            .createQueryBuilder(Demanda, "demanda")
            .leftJoinAndSelect("demanda.oferta", "oferta")
            .select("COUNT(demanda.id)", "total")
            .where("oferta.tipo = :tipo", { tipo: "Paseo" })
            .andWhere("demanda.estado = :estado", { estado: "Realizada" })
            .getRawOne();

        const nGuarderias = await getManager()
            .createQueryBuilder(Demanda, "demanda")
            .leftJoinAndSelect("demanda.oferta", "oferta")
            .select("COUNT(demanda.id)", "total")
            .where("oferta.tipo = :tipo", { tipo: "Guarderia" })
            .andWhere("demanda.estado = :estado", { estado: "Realizada" })
            .getRawOne();


        const nValoraciones = await getManager()
            .createQueryBuilder(Valoracion, "valoracion")
            .select("COUNT(valoracion.id)", "total")
            .getRawOne();

        const mediaValoraciones = await getManager()
            .createQueryBuilder(Valoracion, "valoracion")
            .select("AVG(valoracion.puntuacion)", "average")
            .getRawOne();

        const precioMedioPaseo = await getManager()
            .createQueryBuilder(Oferta, "oferta")
            .select("AVG(oferta.precio)", "average")
            .where("oferta.tipo = :tipo", { tipo: "Paseo" })
            .getRawOne();

        const precioMedioGuarderia = await getManager()
            .createQueryBuilder(Oferta, "oferta")
            .select("AVG(oferta.precio)", "average")
            .where("oferta.tipo = :tipo", { tipo: "Guarderia" })
            .getRawOne();

        const totalInvertidoPaseo = await getManager()
            .createQueryBuilder(Demanda, "demanda")
            .leftJoinAndSelect("demanda.oferta", "oferta")
            .select("SUM(demanda.precio)", "total")
            .where("oferta.tipo = :tipo", { tipo: "Paseo" })
            .andWhere("demanda.estado = :estado", { estado: "Realizada" })
            .getRawOne();

        const totalInvertidoGuarderia = await getManager()
            .createQueryBuilder(Demanda, "demanda")
            .leftJoinAndSelect("demanda.oferta", "oferta")
            .select("SUM(demanda.precio)", "total")
            .where("oferta.tipo = :tipo", { tipo: "Guarderia" })
            .andWhere("demanda.estado = :estado", { estado: "Realizada" })
            .getRawOne();


        const totalInvertido = await getManager()
            .createQueryBuilder(Demanda, "demanda")
            .select("SUM(demanda.precio)", "total")
            .getRawOne();

        let estadisticas = {
            nClientes: nClientes,
            nTutor: nTutor,
            nPaseador: nPaseador,
            nGuardian: nGuardian,
            nMascotas: nMascotas,
            mediaMascotas: mediaMascotas,
            nPerros: nPerros,
            nGatos: nGatos,
            nServicios: nServicios,
            nPaseos: nPaseos,
            nGuarderias: nGuarderias,
            nValoraciones: nValoraciones,
            mediaValoraciones: mediaValoraciones,
            precioMedioPaseo: precioMedioPaseo,
            precioMedioGuarderia: precioMedioGuarderia,
            totalInvertidoPaseo: totalInvertidoPaseo,
            totalInvertidoGuarderia: totalInvertidoGuarderia,
            totalInvertido: totalInvertido
        }

        return {
            data: estadisticas,
            status: 200,
            ok: true,
        }


    } catch (error) {
        console.log('error:' + error)
        return {
            data: error,
            status: 400,
            ok: false,
        }
    }
}

