import { Answer } from '../models/answer'
import { verfifyPassword } from '../utils/auth'
import { sign } from 'hono/jwt'
import { setCookie } from 'hono/cookie'
import { Administrador } from '../entity/Administrador'


export const loginAdmin = async (c: any): Promise<Answer> => {

    const invalidCredentials: Answer = {
        data: 'Invalid Credentials',
        status: 401,
        ok: false,
    }

    const body = await c.req.json()


    try {
        const administrador = await Administrador.findOneBy({
            email: body.email,
        })

        if (!administrador) {
            return invalidCredentials
        }

        const verifyPassword = await verfifyPassword(
            body.password,
            administrador.password
        )

        if (!verifyPassword) {
            return invalidCredentials
        }

        const administradorAutenticado = {
            id_administrador: administrador.id_usuario
        }

        setCookie(
            c,
            'jwt',
            await sign(administradorAutenticado, process.env.JWT_SECRET!!),
            {
                sameSite: 'Lax',
                path: '/',
            }
        )

        return {
            data: 'Inicio de sesion correcto',
            status: 200,
            ok: true,
        }
    } catch (error) {
        return {
            data: 'error',
            status: 422,
            ok: false,
        }
    }
}
