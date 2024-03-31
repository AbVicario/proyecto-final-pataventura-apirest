import { Hono } from "hono"
import { registroCuidador, registroTutor, loginCuidador, loginTutor, mostrarCuidadores } from "../controllers/clienteController"
import { log } from "console"

const app = new Hono()

app.post('/registroCuidador', async (c) => {
    const result = await registroCuidador(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.post('/registroTutor', async (c) => {
    const result = await registroTutor(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.post('/loginCuidador', async (c) => {
    const result = await loginCuidador(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.post('/loginTutor', async (c) => {
    const result = await loginTutor(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.get('/mostrarCuidadores/:tipo', async (c) => {
    console.log('entra')
    const result = await mostrarCuidadores(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

export default app