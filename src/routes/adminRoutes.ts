import { Hono } from "hono"
import { loginAdmin } from "../controllers/adminController.ts"

const app = new Hono()

app.post('/loginAdmin', async (c) => {
    const result = await loginAdmin(c)
    return c.json({ data: result.data, ok: result.ok , status: result.status})
})

export default app