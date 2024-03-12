import { Mascota } from "../../entity/Mascota";
import { Answer } from "../../models/answer";

export const modificarMascota = async (c: any): Promise<Answer> => {
    try {
        const body = await c.req.json();
        const id = c.req.param('id_mascota')
        const tipo = body.tipo
        const mascota = await tipo.findOneBy({id_mascota : id});
        
        if (!mascota) {
            return {
                data: "La mascota no existe",
                status: 404,
                ok: false,
            };
        }else{

            mascota.nombre = body.nombre;
            mascota.edad = body.edad;
            mascota.imagen = body.imagen;
            mascota.tamanyo = body.tamanyo;
            mascota.peso = body.peso;
            mascota.color = body.color;
            mascota.tipo = body.tipo;
            mascota.observacion = body.observacion;
    
            const mascotaActualizada = await tipo.save(mascota);

            if (mascotaActualizada) {
                return {
                    data: "La mascota se actualizó correctamente",
                    status: 200,
                    ok: true,
                };
            } else {
                return {
                    data: "La mascota no se puede actualizar",
                    status: 404,
                    ok: false,
                };
            }
        }

    } catch (error) {
        console.log('error:', error);
        return {
            data: error.message,
            status: 400,
            ok: false,
        };
    }
};