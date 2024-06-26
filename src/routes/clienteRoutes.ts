import { Hono } from "hono"
import {
    registroCuidador, registroTutor, loginCuidador, loginTutor, mostrarCuidadores,
    updateTutor, updateCuidador, getCuidador, getTutor, getCuidadorByDistance
} from "../controllers/clienteController"
import { log } from "console"
import { mostrarTiposMascota, mostrarTiposOferta } from "../controllers/adminController"

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
    const result = await mostrarCuidadores(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.get('/cuidador', async (c) => {
    const result = await getCuidador(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.get('/tutor', async (c) => {
    const result = await getTutor(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.put('/updateTutor/:id_tutor', async (c) => {
    const result = await updateTutor(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.put('/updateCuidador/:id_cuidador', async (c) => {
    const result = await updateCuidador(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})



app.get('/cuidadorByDistance', async (c) => {
    const result = await getCuidadorByDistance(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.get('/tiposMascota', async (c) => {
    const result = await mostrarTiposMascota(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.get('/tiposOferta', async (c) => {
    const result = await mostrarTiposOferta(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

export default app