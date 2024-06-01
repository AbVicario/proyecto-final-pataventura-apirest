import { Hono } from "hono"
//import { mostrarTipos } from "../controllers/tipoController"

const app = new Hono()

/*app.get('/', async (c) => {
    const result = await mostrarTipos(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})*/

export default app