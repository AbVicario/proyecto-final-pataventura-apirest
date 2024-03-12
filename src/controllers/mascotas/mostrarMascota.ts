
import { Mascota } from "../../entity/Mascota";
import { Answer } from "../../models/answer";

export const mostrarMascota = async(c:any): Promise<Answer> =>{

    const id = c.req.param('id_mascota')
    const tipo = c.req.param('tipo')

    try {
        const mascota = await tipo.findOneBy({id_mascota: id });
        if(mascota){
            return {
                data: mascota,
                status: 200,
                ok: true,
            }
        }else{
            return {
                data: "No existe mascota con ese id",
                status: 404,
                ok: false,
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