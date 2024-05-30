import { Hono } from "hono";
import { eliminarDemanda, modificarDemanda, mostrarDemanda, mostrarDemandas, mostrarDemandasAceptadas, solicitarDemanda } from "../controllers/demandaController";

const app = new Hono()

app.post('/', async (c) => {
    const result = await solicitarDemanda(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.delete('/:id_demanda', async (c) => {
    const result = await eliminarDemanda(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.put('/', async (c) => {
    const result = await modificarDemanda(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.get('/aceptadas/:rol', async (c) => {
    const result = await mostrarDemandasAceptadas(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.get('/:id_demanda', async (c) => {
    const result = await mostrarDemanda(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})
app.get('/:id_mascota/:estado', async (c) => {
    const result = await mostrarDemandas(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

export default app

app.post()