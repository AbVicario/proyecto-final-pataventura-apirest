
import { Demanda } from "../../entity/Demanda";
import { Gato } from "../../entity/Gato";
import { Mascota } from "../../entity/Mascota";
import { Perro } from "../../entity/Perro";
import { Answer } from "../../models/answer";

export const eliminarMascota = async(c:any): Promise<Answer> =>{

    const id = c.req.param('id_mascota')
    const tipo = c.req.param('tipo')

    try {
        const mascota = await tipo.findOneBy({id_mascota:id})
        if(!mascota){
            return {
                data: "No existe esa mascota",
                status: 404,
                ok: false,
            }
        }else{
            for (const demanda of mascota.demandas) {
                if(demanda.estado.toLowerCase() == "aceptada" 
                || demanda.estado.toLowerCase() == "pendiente"){
                    demanda.estado = "cancelada_por_tutor"
                    Demanda.save(demanda)
                }  
            }
            const eliminada = await tipo.remove(mascota)
            if(eliminada){
                return {
                    data: "La mascota se elimino correctamente",
                    status: 200,
                    ok: true,
                }
            }else{
                return {
                    data: "La mascota no se elimino correctamente",
                    status: 404,
                    ok: false,
                }
            }
        }
         
    } catch (error) {
        console.log('error:' + error)
        return {
            data: error,
            status: 400,
            ok: false,
        }
    }
}