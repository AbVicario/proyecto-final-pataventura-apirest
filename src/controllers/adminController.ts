import { Answer } from '../models/answer'
import { verfifyPassword } from '../utils/auth'
import { sign } from 'hono/jwt'
import { Administrador } from '../entity/Administrador'
import { crearAdmin } from "../dao/administradorDao"
import { queryRunnerCreate } from "../db/queryRunner"
import { Tutor } from '../entity/Tutor'
import { Cliente } from '../entity/Cliente'
import { Cuidador } from '../entity/Cuidador'
import { Mascota } from '../entity/Mascota'
import { Demanda } from '../entity/Demanda'
import { Valoracion } from '../entity/Valoracion'
import { Oferta } from '../entity/Oferta'
import { dataSource } from '..'
import { setCookie } from 'hono/cookie'


export const loginAdmin = async (c: any): Promise<Answer> => {
    console.log("entra")

    const invalidCredentials: Answer = {
        data: 'Invalid Credentials',
        status: 401,
        ok: false,
    }

    const body = await c.req.json()


    try {
        const administrador = await Administrador.findOneBy({
            email: body.email,
        })

        if (!administrador) {
            return invalidCredentials
        }

        const verifyPassword = await verfifyPassword(
            body.password,
            administrador.password
        )

        if (!verifyPassword) {
            return invalidCredentials
        }

        const administradorAutenticado = {
            id_administrador: administrador.id_usuario
        }

        setCookie(
            c,
            'jwt',
            await sign(administradorAutenticado, process.env.JWT_SECRET!!),
            {
                sameSite: 'Lax',
                path: '/',
            }
        )
        return {
            data: 'Inicio de sesion correcto',
            status: 200,
            ok: true,
        }
    } catch (error) {
        return {
            data: 'error',
            status: 422,
            ok: false,
        }
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

    try {

        const nTutor = await dataSource
            .createQueryBuilder(Tutor, "tutor")
            .select("COUNT(tutor.id_usuario)", "total")
            .getRawOne();

        const nCuidador = await dataSource
            .createQueryBuilder(Cuidador, "cuidador")
            .select("COUNT(cuidador.id_usuario)", "total")
            .getRawOne();

        const nClientes = parseInt(nTutor.total) + parseInt(nCuidador.total)

        const nPaseador = await dataSource
            .createQueryBuilder(Cuidador, "cuidador")
            .leftJoinAndSelect("cuidador.ofertas", "oferta")
            .select("COUNT(cuidador.id_usuario)", "total")
            .where("oferta.tipo = :tipo", { tipo: "Paseo" })
            .getRawOne();

        const nGuardian = await dataSource
            .createQueryBuilder(Cuidador, "cuidador")
            .leftJoinAndSelect("cuidador.ofertas", "oferta")
            .select("COUNT(cuidador.id_usuario)", "total")
            .where("oferta.tipo = :tipo", { tipo: "Guarderia" })
            .getRawOne();

        const nMascotas = await dataSource
            .createQueryBuilder(Mascota, "mascota")
            .select("COUNT(mascota.id_mascota)", "total")
            .getRawOne();

        const mediaMascotas = await dataSource
            .createQueryBuilder(Tutor, "tutor")
            .select("AVG(mascota_count)", "average_pets")
            .from(subQuery => {
                return subQuery
                    .select("tutor.id_usuario", "tutor_id")
                    .addSelect("COUNT(mascota.id_mascota)", "mascota_count")
                    .from("tutor")
                    .leftJoin("tutor.mascotas", "mascota")
                    .groupBy("tutor.id_usuario");
            }, "subQuery")
            .getRawOne();


        const nPerros = await dataSource
            .createQueryBuilder(Mascota, "mascota")
            .select("COUNT(mascota.id_mascota)", "total")
            .where("mascota.tipo = :tipo", { tipo: "Perro" })
            .getRawOne();

        const nGatos = await dataSource
            .createQueryBuilder(Mascota, "mascota")
            .select("COUNT(mascota.id_mascota)", "total")
            .where("mascota.tipo = :tipo", { tipo: "Gato" })
            .getRawOne();


        const nServicios = await dataSource
            .createQueryBuilder(Demanda, "demanda")
            .select("COUNT(demanda.id_demanda)", "total")
            .getRawOne();


        const nPaseos = await dataSource
            .createQueryBuilder(Demanda, "demanda")
            .leftJoinAndSelect("demanda.oferta", "oferta")
            .select("COUNT(demanda.id_demanda)", "total")
            .where("oferta.tipo = :tipo", { tipo: "Paseo" })
            .andWhere("demanda.estado = :estado", { estado: "Realizada" })
            .getRawOne();

        const nGuarderias = await dataSource
            .createQueryBuilder(Demanda, "demanda")
            .leftJoinAndSelect("demanda.oferta", "oferta")
            .select("COUNT(demanda.id_demanda)", "total")
            .where("oferta.tipo = :tipo", { tipo: "Guarderia" })
            .andWhere("demanda.estado = :estado", { estado: "Realizada" })
            .getRawOne();


        const nValoraciones = await dataSource
            .createQueryBuilder(Valoracion, "valoracion")
            .select("COUNT(valoracion.id_valoracion)", "total")
            .getRawOne();

        const mediaValoraciones = await dataSource
            .createQueryBuilder(Valoracion, "valoracion")
            .select("AVG(valoracion.puntuacion)", "average")
            .getRawOne();

        const precioMedioPaseo = await dataSource
            .createQueryBuilder(Oferta, "oferta")
            .select("AVG(oferta.precio)", "average")
            .where("oferta.tipo = :tipo", { tipo: "Paseo" })
            .getRawOne();

        const precioMedioGuarderia = await dataSource
            .createQueryBuilder(Oferta, "oferta")
            .select("AVG(oferta.precio)", "average")
            .where("oferta.tipo = :tipo", { tipo: "Guarderia" })
            .getRawOne();

        const totalInvertidoPaseo = await dataSource
            .createQueryBuilder(Demanda, "demanda")
            .leftJoinAndSelect("demanda.oferta", "oferta")
            .select("SUM(demanda.precio)", "total")
            .where("oferta.tipo = :tipo", { tipo: "Paseo" })
            .andWhere("demanda.estado = :estado", { estado: "Realizada" })
            .getRawOne();

        const totalInvertidoGuarderia = await dataSource
            .createQueryBuilder(Demanda, "demanda")
            .leftJoinAndSelect("demanda.oferta", "oferta")
            .select("SUM(demanda.precio)", "total")
            .where("oferta.tipo = :tipo", { tipo: "Guarderia" })
            .andWhere("demanda.estado = :estado", { estado: "Realizada" })
            .getRawOne();


        const totalInvertido = await dataSource
            .createQueryBuilder(Demanda, "demanda")
            .select("SUM(demanda.precio)", "total")
            .where("demanda.estado = :estado", { estado: "Realizada" })
            .getRawOne();

        let estadisticas = {
            nClientes: nClientes,
            nTutor: parseInt(nTutor.total),
            nPaseador: parseInt(nPaseador.total),
            nGuardian: parseInt(nGuardian.total),
            nMascotas: parseInt(nMascotas.total),
            mediaMascotas: parseFloat(mediaMascotas.average_pets),
            nPerros: parseInt(nPerros.total),
            nGatos: parseInt(nGatos.total),
            nServicios: parseInt(nServicios.total),
            nPaseos: parseInt(nPaseos.total),
            nGuarderias: parseInt(nGuarderias.total),
            nValoraciones: parseInt(nValoraciones),
            mediaValoraciones: parseFloat(mediaValoraciones.average),
            precioMedioPaseo: parseFloat(precioMedioPaseo.average),
            precioMedioGuarderia: parseFloat(precioMedioGuarderia.average),
            totalInvertidoPaseo: parseFloat(totalInvertidoPaseo.total),
            totalInvertidoGuarderia: parseFloat(totalInvertidoGuarderia.total),
            totalInvertido: parseFloat(totalInvertido.total)
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

