
import { Hono } from "hono"
import { eliminarTipoMascota, eliminarTipoOferta, loginAdmin, modificarTipoMascotaAdmin, modificarTipoOfertaAdmin, mostrarEstadisticas, mostrarTiposMascota, mostrarTiposOferta, registroAdmin, registroTipoMascotaAdmin, registroTipoOfertaAdmin } from "../controllers/adminController"

const app = new Hono()
app.post('/loginAdmin', async (c) => {
    const result = await loginAdmin(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})
app.post('/registroAdmin', async (c) => {
    const result = await registroAdmin(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.get('/estadisticas', async (c) => {
    const result = await mostrarEstadisticas(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.post('/registroTipoMascota', async (c) => {
    const result = await registroTipoMascotaAdmin(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.post('/registroTipoOferta', async (c) => {
    const result = await registroTipoOfertaAdmin(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.put('/modificaTipoMascota/:id_tipoMascota', async (c) => {
    const result = await modificarTipoMascotaAdmin(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.put('/modificaTipoOferta/:id_tipoOferta', async (c) => {
    const result = await modificarTipoOfertaAdmin(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.delete('/eliminaTipoMascota/:id_tipoMascota', async (c) => {
    const result = await eliminarTipoMascota(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})

app.delete('/eliminaTipoOferta/:id_tipoOferta', async (c) => {
    const result = await eliminarTipoOferta(c)
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

/*export default async function configureRoutes(app: OpenAPIHono) {
    app.openapi(
        createRoute({
            method: "post",
            path: "/loginAdmin",
            security: [
                {
                    Bearer: [],
                },
            ],
            request: {
                body: {
                    content: {
                        "application/json": {
                            schema: z.object({
                                email: z
                                    .string()
                                    .email()
                                    .openapi({ example: "admin@admin.com" }),
                                password: z
                                    .string()
                                    .min(4)
                                    .max(255)
                                    .openapi({ example: "12345678" }),
                            }),
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "Login successful"
                },
                422: {
                    description: "Invalid email or password",
                },
            },
        }),
        async function (c): Promise<any> {
            const result = await loginAdmin(c);
            return c.json({
                data: result.data, ok: result.ok, status: result.status
            });
        }
    );
}*/