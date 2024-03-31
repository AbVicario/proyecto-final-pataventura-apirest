import { crearOferta } from "../dao/ofertaDao"
import { queryRunnerCreate } from "../db/queryRunner"
import { Cuidador } from "../entity/Cuidador"
import { Oferta } from "../entity/Oferta"
import { Answer } from "../models/answer"

export const guardarOferta = async (c: any): Promise<Answer> => {
    const payload = await c.get('jwtPayload')
    const id_cuidador = payload.id_usuario
    const body = await c.req.json()
    const queryRunner = await queryRunnerCreate()
    try {
        queryRunner.startTransaction()
        const cuidador = await Cuidador.findOneBy(id_cuidador)
        const ofertas = await Oferta.findBy({ cuidador: { id_usuario: id_cuidador } })
        let existe = false
        for (const oferta of ofertas) {
            if (oferta.tipo === body.tipo) {
                existe = true
            }
        }
        if (existe) {
            return {
                data: "No se pueden crear dos ofertas con el mismo tipo",
                status: 404,
                ok: false
            }
        } else {
            const oferta = await crearOferta(body, cuidador, queryRunner)
            if (oferta) {
                return {
                    data: "Oferta creada con exito",
                    status: 200,
                    ok: true
                }
            } else {
                return {
                    data: "Oferta no se pudo crear",
                    status: 404,
                    ok: false
                }
            }
        }

    } catch (error) {
        console.log('error:', error);
        queryRunner.rollbackTransaction()
        return {
            data: error.message,
            status: 400,
            ok: false,
        }
    } finally {
        queryRunner.release()
    }
}

export const eliminarOferta = async (c: any): Promise<Answer> => {
    const id = c.get('jwtPayLoad')
    const tipo = c.param('tipo')
    let result

    try {
        const ofertas = await Oferta.findBy({ cuidador: { id_usuario: id } })
        if (ofertas.length > 1) {
            for (const oferta of ofertas) {
                if (oferta.tipo === tipo) {
                    result = await Oferta.remove(oferta)
                }
            }
            if (!result) {
                return {
                    data: "La oferta no se pudo eliminar",
                    status: 404,
                    ok: false,
                }
            } else {
                return {
                    data: "La oferta se eliminó correctamente",
                    status: 404,
                    ok: false,
                }
            }
        } else {
            return {
                data: "La oferta no se puede eliminar porque es única",
                status: 404,
                ok: false,
            }
        }

    } catch (error) {
        return {
            data: error.message,
            status: 400,
            ok: false,
        }
    }
}

export const modificarOferta = async (c: any): Promise<Answer> => {
    try {
        const body = await c.req.json();
        const tipo = c.req.param('tipo')
        const oferta = await Oferta.findOneBy({ tipo: tipo });

        if (!oferta) {
            return {
                data: "La oferta no existe",
                status: 404,
                ok: false,
            };
        } else {
            const ofertaActualizada = await oferta.save();

            if (ofertaActualizada) {
                return {
                    data: "La oferta  se actualizó correctamente",
                    status: 200,
                    ok: true,
                };
            } else {
                return {
                    data: "La oferta no se puede actualizar",
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

export const mostrarOfertas = async (c: any): Promise<Answer> => {
    const payload = c.get('jwtPayLoad')
    const id_cuidador = payload.id_usuario

    try {
        const ofertas = await Oferta.findBy({ cuidador: { id_usuario: id_cuidador } });
        if (ofertas.length > 0) {
            return {
                data: ofertas,
                status: 200,
                ok: true,
            }
        } else {
            return {
                data: "No existen ofertas para ese cuidador",
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
