import { Hono } from "hono"
import { eliminarValoracion, guardarValoracion, mostrarValoraciones } from "../controllers/valoracionController"

const app = new Hono()

app.post('/', async (c) => {
    const result = await guardarValoracion(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.delete('/:id_valoracion', async (c) => {
    const id = parseInt(c.req.param('id_valoracion'))
    const result = await eliminarValoracion(id)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.get('/:id_cuidador', async (c) => {
    const result = await mostrarValoraciones(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

export default app