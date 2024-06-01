import { crearTipoDao } from "../dao/tipoDao"
import { queryRunnerCreate } from "../db/queryRunner"
//import { Tipo } from "../entity/Tipo"
import { Answer } from "../models/answer"

/*
export const crearTipo = async (c: any): Promise<Answer> => {
    const body = await c.req.json()
    const queryRunner = await queryRunnerCreate()
    try {
        queryRunner.startTransaction()
        const existe = await Tipo.findOneBy({ tipo_animal: body.tipo, raza: body.raza })
        if (existe) {
            return {
                data: "No se pueden crear dos tipos iguales",
                status: 404,
                ok: false
            }
        } else {
            const tipo = await crearTipoDao(body, queryRunner)
            if (tipo) {
                return {
                    data: "Tipo creado con exito",
                    status: 200,
                    ok: true
                }
            } else {
                return {
                    data: "Tipo no se pudo crear",
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
export const mostrarTipos = async (c: any): Promise<Answer> => {
    try {
        const tipos = await Tipo.find();
        if (tipos.length > 0) {
            return {
                data: tipos,
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
}*/