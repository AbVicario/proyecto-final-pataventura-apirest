import { Hono } from "hono"
import { eliminarMascota, guardarMascota, modificarMascota, mostrarMascota, mostrarMascotas } from "../controllers/mascotaController"


const app = new Hono()


app.post('/', async (c) => {
    const result = await guardarMascota(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.get('/one/:id_mascota', async (c) => {
    const result = await mostrarMascota(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.get('/all', async (c) => {
    const result = await mostrarMascotas(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.put('/:id_mascota', async (c) => {
    const result = await modificarMascota(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.delete('/:id_mascota', async (c) => {
    const result = await eliminarMascota(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

export default app