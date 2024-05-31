

import { Context } from 'hono'
import { verify } from 'hono/jwt'

export async function authMiddleware(c: Context, next: Function) {
    console.log("entra")
    const token = c.req.header('Authorization') ?? null

    if (!token) {
        return c.json({ error: 'Invalid token' }, 401)
    }

    const payload = await verify(token, process.env.JWT_SECRET!!)
    console.log(payload)

    if (!payload) {
        return c.json({ error: 'Invalid token' }, 401)
    }
    c.set('jwtPayload', payload)

    return await next()
}