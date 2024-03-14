
import { queryRunnerCreate } from "../db/queryRunner";
import { Valoracion } from "../entity/Valoracion";
import { Answer } from "../models/answer";
import { Demanda } from "../entity/Demanda";
import { crearValoracion } from "../dao/valoracionDao";
import { Cuidador } from "../entity/Cuidador";

export const guardarValoracion = async (c: any): Promise<Answer> => {

    const body = await c.req.json()
    const id_demanda = body.id_demanda
    const queryRunner = await queryRunnerCreate()
    try {
        const demanda = await Demanda.findOneBy({ id_demanda: id_demanda })
        if (demanda.estado === "Cancelada por cuidador" || demanda.estado === "Realizada") {
            const valoracion = await crearValoracion(body, demanda, queryRunner)
            if (valoracion) {
                return {
                    data: "Valoración creada con exito",
                    status: 200,
                    ok: true
                }
            } else {
                return {
                    data: "Valoración no se pudo crear",
                    status: 404,
                    ok: false
                }
            }
        } else {
            return {
                data: " El estado de la demanda no permite valoración",
                status: 404,
                ok: false
            }
        }
    } catch (error) {
        console.log('error:', error);
        return {
            data: error.message,
            status: 400,
            ok: false,
        }
    }
}

export const eliminarValoracion = async (id_valoracion: number): Promise<Answer> => {
    try {
        const valoracion = await Valoracion.findOneBy({ id_valoracion: id_valoracion })
        if (!valoracion) {
            return {
                data: "No se encontro la valoración",
                status: 404,
                ok: false
            }
        } else {
            const result = await valoracion.remove()
            if (result) {
                return {
                    data: "Valoración eliminada con exito",
                    status: 200,
                    ok: true
                }
            } else {
                return {
                    data: "Valoración no se pudo eliminar",
                    status: 404,
                    ok: false
                }
            }
        }

    } catch (error) {
        console.log('error:', error);
        return {
            data: error.message,
            status: 400,
            ok: false,
        }
    }
}

export const mostrarValoraciones = async (id_demanda: number): Promise<Answer> => {
    //revisar (sin acabar)
    try {
        const valoraciones = await Valoracion.findBy({ demanda: { id_demanda: id_demanda } })
        if (valoraciones) {
            return {
                data: valoraciones,
                status: 200,
                ok: true,
            }
        } else {
            return {
                data: "No se encuentran valoraciones",
                status: 404,
                ok: false,
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