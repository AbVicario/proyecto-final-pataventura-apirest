import { Hono } from "hono"
import { crearTipo, mostrarTipos } from "../controllers/tipoController"

const app = new Hono()

app.post('/', async (c) => {
    const result = await crearTipo(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.get('/', async (c) => {
    const result = await mostrarTipos(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

export default app