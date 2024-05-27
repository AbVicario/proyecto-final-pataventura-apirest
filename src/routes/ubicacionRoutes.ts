import { Hono } from "hono"
import { guardarUbicacionCuidador, guardarUbicacionTutor } from "../controllers/ubicacionController"

const app = new Hono()

app.post('/cuidador', async (c) => {
    const result = await guardarUbicacionCuidador(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.post('/tutor', async (c) => {
    const result = await guardarUbicacionTutor(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})


export default app