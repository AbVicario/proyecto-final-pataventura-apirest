import { Answer } from '../models/answer'
import { verfifyPassword } from '../utils/auth'
import { sign } from 'hono/jwt'
import { Administrador } from '../entity/Administrador'
import { crearAdmin, crearTipoMascota, crearTipoOferta } from "../dao/administradorDao"
import { queryRunnerCreate } from "../db/queryRunner"
import { Tutor } from '../entity/Tutor'
import { Cliente } from '../entity/Cliente'
import { Cuidador } from '../entity/Cuidador'
import { Mascota } from '../entity/Mascota'
import { Demanda } from '../entity/Demanda'
import { Valoracion } from '../entity/Valoracion'
import { Oferta } from '../entity/Oferta'
import { dataSource } from '..'
import { TipoMascota } from '../entity/TipoMascota'
import { TipoOferta } from '../entity/TipoOferta'


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


export const registroTipoMascotaAdmin = async (c: any): Promise<Answer> => {

    const queryRunner = await queryRunnerCreate()

    try {
        const body = await c.req.json();
        const tipoMascota = await crearTipoMascota(body, queryRunner);
        await queryRunner.commitTransaction()
        return { data: tipoMascota.id_tipoMascota, status: 200, ok: true };

    } catch (error) {
        await queryRunner.rollbackTransaction()
        return { data: error.message, status: 500, ok: false }

    } finally {
        await queryRunner.release()
    }
}


export const registroTipoOfertaAdmin = async (c: any): Promise<Answer> => {

    const queryRunner = await queryRunnerCreate()

    try {
        const body = await c.req.json();
        const tipoOferta = await crearTipoOferta(body, queryRunner);
        await queryRunner.commitTransaction()
        return { data: tipoOferta.id_tipoOferta, status: 200, ok: true };

    } catch (error) {
        await queryRunner.rollbackTransaction()
        return { data: error.message, status: 500, ok: false }

    } finally {
        await queryRunner.release()
    }
}

export const modificarTipoMascotaAdmin = async (c: any): Promise<Answer> => {

    const body = await c.req.json();
    const id = c.req.param('id_tipoMascota')
    const tipoMascota = await TipoMascota.findOneBy({ id_tipoMascota: id });

    try {
        if (!tipoMascota) {
            return {
                data: "El tipo de mascota no existe",
                status: 404,
                ok: false,
            };
        } else {

            tipoMascota.tipo_animal = body.tipo_animal;
            tipoMascota.razas = body.razas;

            const mascotaActualizada = await tipoMascota.save();

            if (mascotaActualizada) {
                return {
                    data: "El tipo de mascota se actualizó correctamente",
                    status: 200,
                    ok: true,
                };
            } else {
                return {
                    data: "El tipo de mascota no se puede actualizar",
                    status: 404,
                    ok: false,
                };
            }
        }

    } catch (error) {
        return {
            data: error.message,
            status: 400,
            ok: false,
        };
    }
}


export const modificarTipoOfertaAdmin = async (c: any): Promise<Answer> => {

    const body = await c.req.json();
    const id = c.req.param('id_tipoOferta')
    const tipoOferta = await TipoOferta.findOneBy({ id_tipoOferta: id });

    try {
        if (!tipoOferta) {
            return {
                data: "El tipo de oferta no existe",
                status: 404,
                ok: false,
            };
        } else {

            tipoOferta.tipo_servicio = body.tipo_servicio;
            tipoOferta.kilometros = body.kilometros;

            const tipoOfertaActualizada = await tipoOferta.save();

            if (tipoOfertaActualizada) {
                return {
                    data: "El tipo de oferta se actualizó correctamente",
                    status: 200,
                    ok: true,
                };
            } else {
                return {
                    data: "El tipo de oferta no se puede actualizar",
                    status: 404,
                    ok: false,
                };
            }
        }

    } catch (error) {
        return {
            data: error.message,
            status: 400,
            ok: false,
        };
    }
}

export const eliminarTipoMascota = async (c: any): Promise<Answer> => {
    const id = c.req.param('id_tipoMascota')
    const queryRunner = await queryRunnerCreate()
    try {
        const tipoMascota = await TipoMascota.findOneBy({ id_tipoMascota: id })
        if (!tipoMascota) {
            return {
                data: "No existe ese tipo mascota",
                status: 404,
                ok: false,
            }
        } else {
            const eliminada = await queryRunner.manager.remove(tipoMascota)
            await queryRunner.commitTransaction()
            if (eliminada) {
                return {
                    data: "El tipo mascota se elimino correctamente",
                    status: 200,
                    ok: true,
                }
            } else {
                return {
                    data: "El tipo mascota no se elimino correctamente",
                    status: 404,
                    ok: false,
                }
            }
        }

    } catch (error) {
        await queryRunner.rollbackTransaction()
        return {
            data: error,
            status: 400,
            ok: false,
        }
    } finally {
        await queryRunner.release()
    }
}


export const eliminarTipoOferta = async (c: any): Promise<Answer> => {
    const id = c.req.param('id_tipoOferta')
    const queryRunner = await queryRunnerCreate()
    try {
        const tipoOferta = await TipoOferta.findOneBy({ id_tipoOferta: id })
        if (!tipoOferta) {
            return {
                data: "No existe ese tipo oferta",
                status: 404,
                ok: false,
            }
        } else {
            const eliminada = await queryRunner.manager.remove(tipoOferta)
            await queryRunner.commitTransaction()
            if (eliminada) {
                return {
                    data: "El tipo oferta se elimino correctamente",
                    status: 200,
                    ok: true,
                }
            } else {
                return {
                    data: "El tipo oferta no se elimino correctamente",
                    status: 404,
                    ok: false,
                }
            }
        }

    } catch (error) {
        await queryRunner.rollbackTransaction()
        return {
            data: error,
            status: 400,
            ok: false,
        }
    } finally {
        await queryRunner.release()
    }
}