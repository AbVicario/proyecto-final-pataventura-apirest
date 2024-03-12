
/*import { Answer } from "../../models/answer"
import { sign } from 'hono/jwt'
import { verfifyPassword } from "../../utils/auth"
import { Cuidador } from "../../entity/Cuidador"



export const loginCuidador = async (c: any): Promise<Answer> => {

    const body = (await c.req.json()) 

    const cuidador = await Cuidador.findOneBy({
        email : body.email
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
        id_cuidador: cuidador.id_usuario
    }

    const token = await sign(cuidadorAutenticado, process.env.JWT_SECRET!!)

    return {
        data: {
            token,
        },
        status: 200,
        ok: true,
    }
}*/