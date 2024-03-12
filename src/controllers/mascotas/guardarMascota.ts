import { Mascota } from "../../entity/Mascota"
import { Tutor } from "../../entity/Tutor"
import { Answer } from "../../models/answer"

export const guardarMascota = async (c: any): Promise<Answer> =>{
    const idTutor = c.req.param('id_tutor')
    const body = await c.rec.json()
    const tipo = body.tipo
    try {
        const tutor = await Tutor.findOneBy({id_usuario:idTutor})
        if(!tutor){
            return{
                data: 'No existe el tutor',
                status: 404,
                ok: false, 
            }
        }else{
            const mascota = new tipo() 
            mascota.nombre = body.nombre;
            mascota.edad = body.edad || 0;
            mascota.imagen = body.imagen || "";
            mascota.tamanyo = body.tamanyo || 0;
            mascota.peso = body.peso || 0;
            mascota.color = body.color;
            mascota.tipo = body.tipo;
            mascota.observacion = body.observacion || "";
            mascota.tutor = tutor;
            mascota.demandas = []; 
            const result = await mascota.save()
            
            if (!result) {
                return {
                    data: 'Error al crear mascota',
                    status: 422,
                    ok: false,
                }
            } else {
                tutor.mascotas.push(mascota)
                await tutor.save()
                return {
                    data: 'Mascota creada',
                    status: 201,
                    ok: true,
                }
            }
        }
        
    } catch (error) {
        return {
            data: 'Error al procesar la solicitud',
            status: 422,
            ok: false,
        }
    }
}



