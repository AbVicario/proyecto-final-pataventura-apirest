
/*import { Mascota } from "../../entity/Mascota";
import { Answer } from "../../models/answer";

export const mostrarMascotas = async(c:any): Promise<Answer> =>{

    const id = c.req.param('id_tutor')  

    try {
        const mascotas = await Mascota.findBy({tutor: {id_usuario: id }});
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
}*/