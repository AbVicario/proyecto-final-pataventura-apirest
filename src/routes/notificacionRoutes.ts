import { Hono } from "hono"
import { modificarNotificacion, mostrarNotificaciones } from "../controllers/notificacionController"

const app = new Hono()

app.put('/', async (c) => {
    const result = await modificarNotificacion(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.get('/all/:rol', async (c) => {
    const result = await mostrarNotificaciones(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})


export default app