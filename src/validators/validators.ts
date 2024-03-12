import { ZodObject, ZodError } from 'zod';
import { Answer } from '../models/answer';

export const invalidContent = (
    el: any,
    validator: ZodObject<any, any>
): Answer | null => {
    try {
        validator.parse(el);
        return null; 
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.message;
            return {
                data: errorMessage,
                status: 422,
                ok: false,
            };
        } else {
            return {
                data: 'Validation failed',
                status: 422,
                ok: false,
            };
        }
    }
};


