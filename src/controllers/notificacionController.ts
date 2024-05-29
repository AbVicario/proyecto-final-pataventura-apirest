import { escape } from "querystring";
import { Notificacion } from "../entity/Notificacion";
import { Answer } from "../models/answer";

export const modificarNotificacion = async (c: any): Promise<Answer> => {
    try {
        const body = await c.req.json();
        const id = c.req.param('id_alerta')

        const notificacion = await Notificacion.findOneBy({ id_alerta: id });

        if (!notificacion) {
            return {
                data: "La oferta no existe",
                status: 404,
                ok: false,
            };
        } else {
            notificacion.estado = body.estado
            const notificacionActualizada = await notificacion.save();

            if (notificacionActualizada) {
                return {
                    data: "La notificacion se actualizó correctamente",
                    status: 200,
                    ok: true,
                };
            } else {
                return {
                    data: "La notificacion no se puede actualizar",
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
}



export const mostrarNotificaciones = async (c: any): Promise<Answer> => {

    const payload = await c.get('jwtPayload')
    const id_usuario = payload.id_usuario
    const cliente = c.req.param('rol')


    try {
        let notificaciones = await Notificacion.createQueryBuilder("notificacion")
            .innerJoinAndSelect("notificacion.demanda", "demanda")
            .innerJoinAndSelect("demanda.mascota", "mascota")
            .innerJoinAndSelect("mascota.tutor", "tutor")
            .innerJoinAndSelect("demanda.oferta", "oferta")
            .innerJoinAndSelect("oferta.cuidador", "cuidador")
            .where(`${cliente}.id_usuario = :id_usuario`, { id_usuario: id_usuario })
            .andWhere("notificacion.estado != :estado", { estado: 'Borrada' })
            .andWhere("notificacion.destinatario = :destinatario", { destinatario: cliente })
            .orderBy("notificacion.id_alerta", "DESC")
            .getMany()


        if (notificaciones) {
            const notificacionesData = notificaciones.map(notificacion => {
                const fecha = new Date(notificacion.fechaCreacion)
                return {
                    id_alerta : notificacion.id_alerta,
                    fechaCreacion : formatDate(fecha),
                    estado : notificacion.estado,
                    descripcion : notificacion.descripcion,
                    demanda : notificacion.demanda,
                    tipo : notificacion.demanda.oferta.tipo,
                    direccion : notificacion.demanda.mascota.tutor.direccion,
                    mascotaName : notificacion.demanda.mascota.nombre
                };
            });

            return {
                data: notificacionesData,
                status: 200,
                ok: true,
            }
        } else {
            return {
                data: "No se encuentran notificaciones",
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

function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
