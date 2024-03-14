import { Context } from 'hono'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import { createFactory, createMiddleware } from 'hono/factory'

/*export async function authMiddleware(c: Context, next: Function) {
    const token = c.req.header('Authorization') ?? getCookie(c, 'jwt') ?? null

    if (!token) {
        return c.json({ error: 'Invalid token' }, 401)
    }

    const payload = await verify(token, process.env.JWT_SECRET!!)

    if (!payload) {
        return c.json({ error: 'Invalid token' }, 401)
    }
    c.set('jwtPayload', payload)

    return await next()
}*/

export const authMiddleware = createMiddleware(async (c: Context, next: Function) => {
    const token = c.req.header('Authorization') ?? getCookie(c, 'jwt') ?? null

    if (!token) {
        return c.json({ error: 'Invalid token' }, 401)
    }

    const payload = await verify(token, process.env.JWT_SECRET!!)

    if (!payload) {
        return c.json({ error: 'Invalid token' }, 401)
    }
    c.set('jwtPayload', payload)

    return await next()
})