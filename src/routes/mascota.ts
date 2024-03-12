import { Hono } from "hono"
import { guardarMascota } from "../controllers/mascotas/guardarMascota"
import { mostrarMascota } from "../controllers/mascotas/mostrarMascota"
import { mostrarMascotas } from "../controllers/mascotas/mostrarMascotas"
import { modificarMascota } from "../controllers/mascotas/modificarMascota"
import { eliminarMascota } from "../controllers/mascotas/eliminarMascota"

const app = new Hono()

app.post('/:id_tutor', async (c) => {
    const result = await guardarMascota(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.get('/one/:id_mascota/:tipo', async (c) => {
    const result = await mostrarMascota(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.get('/all/:id_tutor/:tipo', async (c) => {
    const result = await mostrarMascotas(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.put('/:id_mascota', async (c) => {
    const result = await modificarMascota(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.delete('/:id_mascota/:tipo', async (c) => {
    const result = await eliminarMascota(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

export default app