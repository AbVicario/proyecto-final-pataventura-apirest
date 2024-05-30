
import { Hono } from "hono"
import { loginAdmin, registroAdmin } from "../controllers/adminController"

const app = new Hono()
app.post('/loginAdmin', async (c) => {
    const result = await loginAdmin(c)
    return c.json({ data: result.data, ok: result.ok, status: result.status })
})
app.post('/registroAdmin', async (c) => {
    const result = await registroAdmin(c)
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