import { crearDemanda } from "../dao/demandaDao";
import { queryRunnerCreate } from "../db/queryRunner";
import { Cuidador } from "../entity/Cuidador";
import { Demanda } from "../entity/Demanda";
import { Mascota } from "../entity/Mascota";
import { Tutor } from "../entity/Tutor";
import { Answer } from "../models/answer";

export const eliminarDemanda = async (c: any): Promise<Answer> => {

    const id = c.req.param('id_demanda')
    const queryRunner = await queryRunnerCreate()
    try {
        const demanda = await Demanda.findOneBy({ id_demanda: id })
        if (!demanda) {
            return {
                data: "No existe esa demanda",
                status: 404,
                ok: false,
            }
        } else {
            if (demanda.estado === "Aceptada") {
                return {
                    data: "No se puede eliminar esa demanda",
                    status: 404,
                    ok: false,
                }
            } else {
                const eliminada = await queryRunner.manager.remove(demanda)
                await queryRunner.commitTransaction()
                if (eliminada) {
                    return {
                        data: "La demanda se elimino correctamente",
                        status: 200,
                        ok: true,
                    }
                } else {
                    return {
                        data: "La demanda no se pudo eleminar",
                        status: 404,
                        ok: false,
                    }
                }
            }
        }
    } catch (error) {
        console.log('error:' + error)
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

export const solicitarDemanda = async (c: any): Promise<Answer> => {
    const payload = await c.get('jwtPayload')
    const id = payload.id_usuario
    const body = await c.req.json()
    const id_cuidador = body.id_cuidador
    const queryRunner = await queryRunnerCreate()

    try {
        const tutor = await Tutor.findOneBy({ id_usuario: id })
        await queryRunner.commitTransaction()
        if (!tutor) {
            return {
                data: 'No existe el tutor',
                status: 404,
                ok: false,
            }
        } else {
            const mascota = await Mascota.findOneBy({ tutor: { id_usuario: id } })

            if (!mascota) {
                return {
                    data: 'El tutor no tiene mascota',
                    status: 404,
                    ok: false,
                }
            } else {
                const cuidador = await Cuidador.findOneBy({ id_usuario: id_cuidador })
                if (!cuidador) {
                    return {
                        data: 'El cuidador no existe',
                        status: 404,
                        ok: false,
                    }
                } else {
                    const demanda = crearDemanda(body, mascota, cuidador, queryRunner)
                    if (!demanda) {
                        return {
                            data: 'Demanda creada con exito',
                            status: 200,
                            ok: true,
                        }
                    } else {
                        return {
                            data: 'No se pudo crear la demanda',
                            status: 404,
                            ok: false,
                        }
                    }
                }
            }
        }
    } catch (error) {
        await queryRunner.rollbackTransaction()
        return {
            data: 'Error al procesar la solicitud' + error,
            status: 422,
            ok: false,
        }
    } finally {
        await queryRunner.release()
    }
}

export const modificarDemanda = async (c: any): Promise<Answer> => {
    try {
        const body = await c.req.json();
        const id = c.req.param('id_demanda')
        const demanda = await Demanda.findOneBy({ id_demanda: id });

        if (!demanda) {
            return {
                data: "La demanda no existe",
                status: 404,
                ok: false,
            };
        } else {
            if (demanda.estado === "Pendiente") {
                demanda.fechaInicio = body.fechaInicio
                demanda.fechaFin = body.fechaFin
                demanda.descripcion = body.descripcion
            }
            const demandaActualizada = await demanda.save();

            if (demandaActualizada) {
                return {
                    data: "La demanda se actualizó correctamente",
                    status: 200,
                    ok: true,
                };
            } else {
                return {
                    data: "La demanda no se puede actualizar",
                    status: 404,
                    ok: false,
                };
            }
        }

    } catch (error) {
        console.log('error:', error);
        return {
            data: error.message,
            status: 400,
            ok: false,
        };
    }
}

export const mostrarDemanda = async (c: any): Promise<Answer> => {

    const id = c.req.param('id_demanda')

    try {
        const mascota = await Demanda.findOneBy({ id_demanda: id });
        if (mascota) {
            return {
                data: mascota,
                status: 200,
                ok: true,
            }
        } else {
            return {
                data: "No existe demanda con ese id",
                status: 404,
                ok: false,
            }
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

export const mostrarDemandas = async (c: any): Promise<Answer> => {

    const id = c.req.param('id_mascota')
    const estado = c.req.param('estado')

    try {


        const demandas = await Demanda.findBy({ mascota: { id_mascota: id }, estado: estado })
        if (demandas) {
            return {
                data: demandas,
                status: 200,
                ok: true,
            }
        } else {
            return {
                data: "No se encuentran demandas ",
                status: 404,
                ok: false,
            }
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