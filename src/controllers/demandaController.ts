import { crearDemanda } from "../dao/demandaDao";
import { crearNotificacion } from "../dao/notificacionDao";
import { queryRunnerCreate } from "../db/queryRunner";
import { Demanda } from "../entity/Demanda";
import { Mascota } from "../entity/Mascota";
import { Oferta } from "../entity/Oferta";
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
    const body = await c.req.json()
    const id_mascota = body.id_mascota
    const id_oferta = body.id_oferta
    const queryRunner = await queryRunnerCreate()

    try {
        const mascota = await Mascota.findOneBy({ id_mascota: id_mascota })
        const oferta = await Oferta.findOneBy({ id_oferta: id_oferta })
        if (!mascota) {
            return {
                data: 'Error, la mascota no existe',
                status: 404,
                ok: false,
            }
        } else if (!oferta) {
            return {
                data: 'Error, la oferta no existe',
                status: 404,
                ok: false,
            }
        } else {
            const demanda = await crearDemanda(body, mascota, oferta, queryRunner)
            await crearNotificacion("Tienes una nueva solicitud.", demanda, queryRunner)
            await queryRunner.commitTransaction()
            if (demanda) {
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