
import { Mascota } from "../../entity/Mascota";
import { Answer } from "../../models/answer";

export const mostrarMascotas = async(c:any): Promise<Answer> =>{

    const id = c.req.param('id_tutor')  
    const tipo = c.req.param('tipo')  

    try {
        const mascotas = await tipo.findBy({tutor: {id_usuario: id }});
        if(mascotas.length > 0){
            return {
                data: mascotas,
                status: 200,
                ok: true,
            }
        }else{
            return {
                data: "El tutor no tiene mascotas",
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