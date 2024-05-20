import { startTransition } from "hono/jsx"
import { crearOferta } from "../dao/ofertaDao"
import { queryRunnerCreate } from "../db/queryRunner"
import { Cuidador } from "../entity/Cuidador"
import { Oferta } from "../entity/Oferta"
import { Answer } from "../models/answer"

export const guardarOferta = async (c: any): Promise<Answer> => {
    const payload = await c.get('jwtPayload')
    const id_cuidador = payload.id_usuario
    const body = await c.req.json()
    console.log(body)
    const queryRunner = await queryRunnerCreate()
    try {
        const cuidador = await Cuidador.findOneBy({ id_usuario: id_cuidador })
        const ofertas = await Oferta.findBy({ cuidador: { id_usuario: id_cuidador } })
        console.log(ofertas)
        let existe = false
        for (const oferta of ofertas) {
            console.log(oferta)
            if (oferta.tipo == body.tipo) {
                console.log("entra")
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
            await queryRunner.commitTransaction()
            if (oferta) {
                return {
                    data: oferta.id_oferta,
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
        await queryRunner.rollbackTransaction()
        return {
            data: error.message,
            status: 400,
            ok: false,
        }
    } finally {
        await queryRunner.release()
    }
}

export const eliminarOferta = async (c: any): Promise<Answer> => {
    const id = await c.get('jwtPayLoad')
    console.log(await c.req.param('id_oferta'))
    const id_oferta: number = await c.req.param('id_oferta')
    var result: any
    console.log(id_oferta)

    try {
        const ofertas = await Oferta.findBy({ cuidador: { id_usuario: id } })
        console.log(ofertas)

        for (const oferta of ofertas) {

            console.log(oferta)
            if (oferta.id_oferta == id_oferta) {
                console.log("entra")
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
                status: 200,
                ok: true,
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
        const id = c.req.param('id_oferta')
        const oferta = await Oferta.findOneBy({ id_oferta: id });

        console.log(body)

        console.log(oferta)

        if (!oferta) {
            return {
                data: "La oferta no existe",
                status: 404,
                ok: false,
            };
        } else {
            oferta.descripcion = body.descripcion
            oferta.precio = body.precio
            oferta.radio = body.radio
            const ofertaActualizada = await oferta.save();
            console.log(ofertaActualizada)

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
    const payload = await c.get('jwtPayload')
    console.log(payload)
    const id_cuidador = payload.id_usuario
    console.log(id_cuidador)

    try {
        const ofertas = await Oferta.findBy({ cuidador: { id_usuario: id_cuidador } });
        console.log(ofertas)
        if (ofertas.length > 0) {
            return {
                data: ofertas,
                status: 200,
                ok: true,
            }
        } else {
            return {
                data: ofertas,
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
