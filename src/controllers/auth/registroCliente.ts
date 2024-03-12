import { Answer } from '../../models/answer';
import { crearMascota } from '../../dao/mascotasDao';
import { crearCuidador } from '../../dao/cuidadorDao';
import { crearTutor } from '../../dao/tutorDao';
import { crearUbicacion } from '../../dao/ubicacionDao';
import { crearOferta } from '../../dao/ofertaDao';


export const registroCliente = async (c: any): Promise<Answer> => {
    try {
        
        const body = await c.req.json();

        if (body.tipoCliente === "tutor") {
            const tutor = await crearTutor(body);
            const ubicacion = await crearUbicacion(body, tutor);
            if(ubicacion) tutor.direcciones.push(ubicacion)
            

            const mascota = await crearMascota(body, tutor);
            if (mascota) tutor.mascotas.push(mascota);

            await tutor.save();

            return { data: 'El tutor se ha creado con éxito', status: 200, ok: true };
        } else if (body.tipoCliente === "cuidador") {
            const cuidador = await crearCuidador(body);
            await crearOferta(body, cuidador);

            return { data: 'El cuidador se ha creado con éxito', status: 200, ok: true };
        } else {
            return { data: 'Tipo de cliente no disponible', status: 404, ok: false };
        }
    } catch (error) {
        return { data: error.message, status: 500, ok: false };
    }
};