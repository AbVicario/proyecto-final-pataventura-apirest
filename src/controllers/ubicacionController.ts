
import { crearUbicacionCuidador, crearUbicacionTutor } from "../dao/ubicacionDao"
import { queryRunnerCreate } from "../db/queryRunner"
import { Cuidador } from "../entity/Cuidador"
import { Tutor } from "../entity/Tutor"
import { Ubicacion } from "../entity/Ubicacion"
import { Answer } from "../models/answer"

export const guardarUbicacionCuidador = async (c: any): Promise<Answer> => {
    const payload = await c.get('jwtPayload')
    const id_cuidador = payload.id_usuario
    const body = await c.req.json()
    console.log(body)
    const queryRunner = await queryRunnerCreate()
    try {
        const cuidador = await Cuidador.findOneBy({ id_usuario: id_cuidador })

        const ubicacion = await Ubicacion.findOneBy({ cuidador: { id_usuario: id_cuidador } })

        if (ubicacion) {
            await Ubicacion.remove(ubicacion)
        }

        let ubicacionNew = null
        if (ubicacion) {
            console.log("ya tenia ubicacion")
            ubicacion.coordenadas = body.coordenadas
            ubicacionNew = await ubicacion.save();

        } else {
            ubicacionNew = await crearUbicacionCuidador(body, cuidador, queryRunner)
            console.log(" nueva ubicacion" + ubicacionNew)
        }


        await queryRunner.commitTransaction()
        if (ubicacionNew) {
            return {
                data: ubicacionNew.id_ubicacion,
                status: 200,
                ok: true
            }
        } else {
            return {
                data: "La ubicación no se pudo crear",
                status: 404,
                ok: false
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


export const guardarUbicacionTutor = async (c: any): Promise<Answer> => {
    console.log("entra en guardar ubicacion")
    const payload = await c.get('jwtPayload')
    const id_tutor = payload.id_usuario
    const body = await c.req.json()
    console.log(body)
    const queryRunner = await queryRunnerCreate()
    try {
        const tutor = await Tutor.findOneBy({ id_usuario: id_tutor })
        console.log("recupera el tutor: " + tutor)
        const ubicacion = await Ubicacion.findOneBy({ tutor: { id_usuario: id_tutor } })

        let ubicacionNew = null
        if (ubicacion) {
            console.log("ya tenia ubicacion")
            ubicacion.coordenadas = body.coordenadas
            ubicacionNew = await ubicacion.save();

        } else {
            ubicacionNew = await crearUbicacionTutor(body, tutor, queryRunner)
            console.log(" nueva ubicacion" + ubicacionNew)
        }


        await queryRunner.commitTransaction()
        if (ubicacionNew) {
            return {
                data: ubicacionNew.id_ubicacion,
                status: 200,
                ok: true
            }
        } else {
            return {
                data: "La ubicación no se pudo crear",
                status: 404,
                ok: false
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
