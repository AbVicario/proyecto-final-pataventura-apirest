import { crearOferta } from "../dao/ofertaDao"
import { queryRunnerCreate } from "../db/queryRunner"
import { Cuidador } from "../entity/Cuidador"
import { Answer } from "../models/answer"

export const guardarOferta = async (c: any): Promise<Answer> => {
    const payload = await c.get('jwtPayload')
    const id_cuidador = payload.id_usuario
    const body = await c.req.json()
    const queryRunner = await queryRunnerCreate()
    try {
        queryRunner.startTransaction()
        const cuidador = await Cuidador.findOneBy(id_cuidador)
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

