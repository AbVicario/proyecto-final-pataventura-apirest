import { z } from "zod";

const errors = {
    invalid_credentials: 'Las credenciales no son validas',
    password_length: 'El email no es valido'
}

export const ValidacionAdminLogin = z.object({
    email: z
        .string()
        .min(1, { message: errors.invalid_credentials })
        .email({ message: errors.invalid_credentials }),
    password: z.string().min(1, { message: errors.invalid_credentials }).trim(),
})

export const ValidacionClienteRegistro = z.object({
    name: z
        .string()
        .min(1, { message: 'El nombre no es valido' })
        .trim(),
    surname: z.string().trim(),
    email: z
        .string()
        .min(1)
        .email({ message: 'El email no es valido' }),
    password: z.string().min(4, { message: errors.password_length }).trim(),
})