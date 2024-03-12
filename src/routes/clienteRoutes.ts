import { Hono } from "hono"
import {registroCuidador, registroTutor, loginCuidador, loginTutor } from "../controllers/clienteController"
import { loginAdmin } from "../controllers/adminController.ts"

const app = new Hono()

app.post('/registroCuidador', async (c) => {
    const result = await registroCuidador(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.post('/registroTutor', async (c) => {
    const result = await registroTutor(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.post('/loginCuidador', async (c) => {
    const result = await loginCuidador(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.post('/loginTutor', async (c) => {
    const result = await loginTutor(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

export default app