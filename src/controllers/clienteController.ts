
import { Answer } from "../models/answer"
import { sign } from 'hono/jwt'
import { verfifyPassword } from "../utils/auth"
import { Cuidador } from "../entity/Cuidador"
import { Tutor } from "../entity/Tutor"
import { crearTutor } from "../dao/tutorDao"
import { crearUbicacionCuidador, crearUbicacionTutor } from "../dao/ubicacionDao"
import { crearMascota } from "../dao/mascotasDao"
import { crearCuidador } from "../dao/cuidadorDao"
import { crearOferta } from "../dao/ofertaDao"
import { queryRunnerCreate } from "../db/queryRunner"
import { encontrarUsuariosCercanos } from "../utils/encontarUsuarios"
import { Ubicacion } from "../entity/Ubicacion"
import { Oferta } from "../entity/Oferta"

export const loginCuidador = async (c: any): Promise<Answer> => {

    const body = (await c.req.json())

    const cuidador = await Cuidador.findOneBy({
        email: body.email
    })

    if (!cuidador) {
        return {
            data: 'Email no encontrado',
            status: 401,
            ok: false,
        }
    }

    const verifyPassword = await verfifyPassword(
        body.password,
        cuidador.password
    )

    if (!verifyPassword) {
        return {
            data: 'Invalid credentials',
            status: 422,
            ok: false,
        }
    }

    const cuidadorAutenticado = {
        id_usuario: cuidador.id_usuario,
        tipo: "Cuidador",
    }

    const token = await sign(cuidadorAutenticado, process.env.JWT_SECRET!!)

    return {
        data: {
            token,
        },
        status: 200,
        ok: true,
    }
}

export const loginTutor = async (c: any): Promise<Answer> => {

    const body = (await c.req.json())

    const tutor = await Tutor.findOneBy({
        email: body.email
    })

    if (!tutor) {
        return {
            data: 'Email no encontrado',
            status: 401,
            ok: false,
        }
    }

    const verifyPassword = await verfifyPassword(
        body.password,
        tutor.password
    )

    if (!verifyPassword) {
        return {
            data: 'Invalid credentials',
            status: 422,
            ok: false,
        }
    }

    const tutorAutenticado = {
        id_usuario: tutor.id_usuario,
        tipo: "Tutor"
    }

    const token = await sign(tutorAutenticado, process.env.JWT_SECRET!!)

    return {
        data: {
            token,
        },
        status: 200,
        ok: true,
    }
}
//Haciendo pruebas del registro descubrí que se insertaba el objeto tutor sin mascota.
// Lo arreglé modificando el controlador añadiendo un rollback a la transaccion con los recursos que me da typeORM 
export const registroTutor = async (c: any): Promise<Answer> => {

    const queryRunner = await queryRunnerCreate()

    try {
        const body = await c.req.json();
        const tutor = await crearTutor(body, queryRunner);
        await crearUbicacionTutor(body, tutor, queryRunner);


        const mascota = await crearMascota(body, tutor, queryRunner);

        if (mascota) tutor.mascotas.push(mascota);
        await queryRunner.manager.save(tutor);

        await queryRunner.commitTransaction()
        return { data: 'El tutor se ha creado con éxito', status: 200, ok: true };

    } catch (error) {
        await queryRunner.rollbackTransaction()
        return { data: error.message, status: 500, ok: false }

    } finally {
        await queryRunner.release()
    }
};

export const registroCuidador = async (c: any): Promise<Answer> => {
    const queryRunner = await queryRunnerCreate()
    try {

        const body = await c.req.json();
        const cuidador = await crearCuidador(body, queryRunner);
        await crearUbicacionCuidador(body, cuidador, queryRunner);

        const oferta = await crearOferta(body, cuidador, queryRunner);
        if (oferta) cuidador.ofertas.push(oferta)
        await queryRunner.commitTransaction()
        return { data: 'El cuidador se ha creado con éxito', status: 200, ok: true };

    } catch (error) {
        await queryRunner.rollbackTransaction()
        return { data: error.message, status: 500, ok: false };
    } finally {
        await queryRunner.release()
    }
};

export const mostrarCuidadores = async (c: any): Promise<Answer> => {
    const tipo = c.req.param('tipo')
    try {
        const cuidadores = await Cuidador.createQueryBuilder("cuidador").innerJoin("cuidador.ofertas", "oferta").where("oferta.tipo = :tipo", { tipo }).getMany()

        if (cuidadores.length <= 0) {
            return {
                data: "No se encuentran cuidadores del tipo: " + tipo,
                status: 404,
                ok: false
            }
        } else {
            return {
                data: cuidadores,
                status: 200,
                ok: true
            }
        }
    } catch (error) {
        return { data: error.message, status: 500, ok: false };
    }
}


