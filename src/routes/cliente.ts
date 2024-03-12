import { Hono } from "hono"
import {registroCliente } from "../controllers/auth/registroCliente"
//import { loginCuidador } from "../controllers/auth/loginCuidador"
//import { loginTutor } from "../controllers/auth/loginTutor"
//import { loginAdmin } from "../controllers/auth/loginAdmin"
import { log } from "console"

const app = new Hono()

app.post('/', async (c) => {
    console.log("ENTRAAA");
    
    const result = await registroCliente(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

/*app.post('/loginCuidador', async (c) => {
    const result = await loginCuidador(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.post('/loginTutor', async (c) => {
    const result = await loginTutor(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

app.post('/loginAdmin', async (c) => {
    const result = await loginAdmin(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})*/

export default app