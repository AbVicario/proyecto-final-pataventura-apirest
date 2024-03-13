import { Hono } from "hono"
import { guardarOferta } from "../controllers/ofertaController"

const app = new Hono()

app.post('/', async (c) => {
    const result = await guardarOferta(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

/*app.delete('/', async (c) => {
    const result = await eliminarOferta(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})*/

export default app