
/*import { Answer } from "../../models/answer"
import { Tutor } from "../../entity/Tutor"
import { sign } from 'hono/jwt'
import { verfifyPassword } from "../../utils/auth"



export const loginTutor = async (c: any): Promise<Answer> => {

    const body = (await c.req.json()) 

    const tutor = await Tutor.findOneBy({
        email : body.email
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
        id_tutor: tutor.id_usuario
    }

    const token = await sign(tutorAutenticado, process.env.JWT_SECRET!!)

    return {
        data: {
            token,
        },
        status: 200,
        ok: true,
    }
}*/