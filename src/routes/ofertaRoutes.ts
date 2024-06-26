import { Hono } from "hono"
import { eliminarOferta, guardarOferta, modificarOferta, mostrarOfertas } from "../controllers/ofertaController"

const app = new Hono()

app.post('/', async (c) => {
    const result = await guardarOferta(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.delete('/:id_oferta', async (c) => {
    const result = await eliminarOferta(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.put('/:id_oferta', async (c) => {
    const result = await modificarOferta(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })

})

app.get("/all", async (c) => {
    const result = await mostrarOfertas(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })

})

export default app