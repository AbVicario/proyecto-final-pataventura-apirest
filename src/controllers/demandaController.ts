import { crearDemanda } from "../dao/demandaDao";
import { crearNotificacion } from "../dao/notificacionDao";
import { queryRunnerCreate } from "../db/queryRunner";
import { Demanda } from "../entity/Demanda";
import { Mascota } from "../entity/Mascota";
import { Oferta } from "../entity/Oferta";
import { Answer } from "../models/answer";

export const eliminarDemanda = async (c: any): Promise<Answer> => {

    const id = c.req.param('id_demanda')
    const queryRunner = await queryRunnerCreate()
    try {
        const demanda = await Demanda.findOneBy({ id_demanda: id })
        if (!demanda) {
            return {
                data: "No existe esa demanda",
                status: 404,
                ok: false,
            }
        } else {
            if (demanda.estado == "Aceptada") {
                return {
                    data: "No se puede eliminar esa demanda",
                    status: 404,
                    ok: false,
                }
            } else {
                const eliminada = await queryRunner.manager.remove(demanda)
                await queryRunner.commitTransaction()
                if (eliminada) {
                    return {
                        data: "La demanda se elimino correctamente",
                        status: 200,
                        ok: true,
                    }
                } else {
                    return {
                        data: "La demanda no se pudo eleminar",
                        status: 404,
                        ok: false,
                    }
                }
            }
        }
    } catch (error) {
        console.log('error:' + error)
        await queryRunner.rollbackTransaction()
        return {
            data: error,
            status: 400,
            ok: false,
        }
    } finally {
        await queryRunner.release()
    }
}

export const solicitarDemanda = async (c: any): Promise<Answer> => {
    const body = await c.req.json()
    const id_mascota = body.id_mascota
    const id_oferta = body.id_oferta
    const queryRunner = await queryRunnerCreate()

    try {
        const mascota = await Mascota.findOneBy({ id_mascota: id_mascota })
        const oferta = await Oferta.findOneBy({ id_oferta: id_oferta })
        if (!mascota) {
            return {
                data: 'Error, la mascota no existe',
                status: 404,
                ok: false,
            }
        } else if (!oferta) {
            return {
                data: 'Error, la oferta no existe',
                status: 404,
                ok: false,
            }
        } else {
            const demanda = await crearDemanda(body, mascota, oferta, queryRunner)
            await crearNotificacion("Tienes una nueva solicitud.", "cuidador", demanda, queryRunner)
            await queryRunner.commitTransaction()
            if (demanda) {
                return {
                    data: 'Demanda creada con exito',
                    status: 200,
                    ok: true,
                }
            } else {
                return {
                    data: 'No se pudo crear la demanda',
                    status: 404,
                    ok: false,
                }
            }
        }
    } catch (error) {
        await queryRunner.rollbackTransaction()
        return {
            data: 'Error al procesar la solicitud' + error,
            status: 422,
            ok: false,
        }
    } finally {
        await queryRunner.release()
    }
}

export const modificarDemanda = async (c: any): Promise<Answer> => {
    const body = await c.req.json();
    const id = body.id_demanda
    const queryRunner = await queryRunnerCreate()
    try {

        const demanda = await Demanda.findOneBy({ id_demanda: id });

        if (!demanda) {
            return {
                data: "La demanda no existe",
                status: 404,
                ok: false,
            };
        } else {

            demanda.estado = body.estado
            const demandaActualizada = await demanda.save();

            let descripcion = "";
            let destinatario = "";
            switch (body.estado) {
                case "Aceptada":
                    descripcion = "La demanda ha sido aceptada. Puedes verla en tu calendario";
                    destinatario = "tutor";
                    break;
                case "Rechazada":
                    descripcion = "La demanda ha sido rechazada por el cuidador";
                    destinatario = "tutor";
                    break;
                case "Cancelada tutor":
                    descripcion = "La demanda ha sido cancelada por el tutor";
                    destinatario = "cuidador";
                    break;
                case "Cancelada cuidador":
                    descripcion = "La demanda ha sido cancelada por el cuidador";
                    destinatario = "tutor";
                    break;
                default:
                    descripcion = "Estado desconocido.";
                    destinatario = "desconocido";
                    break;
            }
            await crearNotificacion(descripcion, destinatario, demanda, queryRunner)
            await queryRunner.commitTransaction()

            if (demandaActualizada) {
                return {
                    data: "La demanda se actualizó correctamente",
                    status: 200,
                    ok: true,
                };
            } else {
                return {
                    data: "La demanda no se puede actualizar",
                    status: 404,
                    ok: false,
                };
            }
        }

    } catch (error) {
        await queryRunner.rollbackTransaction()
        console.log('error:', error);
        return {
            data: error.message,
            status: 400,
            ok: false,
        };
    } finally {
        await queryRunner.release()
    }
}

export const mostrarDemanda = async (c: any): Promise<Answer> => {

    const id = c.req.param('id_demanda')

    try {
        const mascota = await Demanda.findOneBy({ id_demanda: id });
        if (mascota) {
            return {
                data: mascota,
                status: 200,
                ok: true,
            }
        } else {
            return {
                data: "No existe demanda con ese id",
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

export const mostrarDemandas = async (c: any): Promise<Answer> => {

    const id = c.req.param('id_mascota')
    const estado = c.req.param('estado')

    try {


        const demandas = await Demanda.findBy({ mascota: { id_mascota: id }, estado: estado })
        if (demandas) {
            return {
                data: demandas,
                status: 200,
                ok: true,
            }
        } else {
            return {
                data: "No se encuentran demandas ",
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


export const mostrarDemandasAceptadas = async (c: any): Promise<Answer> => {
    const payload = await c.get('jwtPayload')
    const id_usuario = payload.id_usuario
    const cliente = c.req.param('rol')

    try {

        let demandas = await Demanda.createQueryBuilder("demanda")
            .innerJoinAndSelect("demanda.mascota", "mascota")
            .innerJoinAndSelect("mascota.tutor", "tutor")
            .innerJoinAndSelect("demanda.oferta", "oferta")
            .innerJoinAndSelect("oferta.cuidador", "cuidador")
            .where(`${cliente}.id_usuario = :id_usuario`, { id_usuario: id_usuario })
            .andWhere("demanda.estado = :estado", { estado : "Aceptada"})
            .getMany()

        if (demandas) {

            const demandasData = demandas.map(demanda => {
                const fechaInicio = new Date(demanda.fechaInicio)
                const fechaFin = new Date(demanda.fechaFin)
                const cuidador = demanda.oferta.cuidador
                const cuidadorData = {
                    id_usuario: cuidador.id_usuario,
                    email: cuidador.email,
                    password: cuidador.password,
                    telefono: cuidador.telefono,
                    nombre: cuidador.nombre,
                    apellido: cuidador.apellido,
                    imagen: cuidador.imagen ? Array.from(cuidador.imagen) : null,
                    alias: cuidador.alias,
                    direccion: cuidador.direccion
                }

                const oferta = demanda.oferta
                const ofertaData = {
                    id_oferta : oferta.id_oferta,
                    tipo : oferta.tipo,
                    descripcion : oferta.descripcion,
                    precio : oferta.precio,
                    radio : oferta.radio,
                    cuidador : cuidadorData
                }
    
                const tutor = demanda.mascota.tutor
                const tutorData = {
                    id_usuario: tutor.id_usuario,
                    email: tutor.email,
                    password: tutor.password,
                    telefono: tutor.telefono,
                    nombre: tutor.nombre,
                    apellido: tutor.apellido,
                    imagen: tutor.imagen ? Array.from(cuidador.imagen) : null,
                    alias: tutor.alias,
                    direccion: tutor.direccion
                }

                const mascota = demanda.mascota
                const mascotaData = {
                    id_mascota: mascota.id_mascota,
                    nombre: mascota.nombre,
                    num_chip: mascota.num_chip,
                    edad: mascota.edad,
                    imagen: mascota.imagen ? Array.from(mascota.imagen) : null,
                    tamanyo: mascota.tamanyo,
                    peso: mascota.peso,
                    tipo: mascota.tipo,
                    raza: mascota.raza,
                    color: mascota.color,
                    observacion: mascota.observacion,
                    sexo: mascota.sexo,
                    tutor: tutorData,
                    demandas: mascota.demandas
                };

                return {
                    id_demanda : demanda.id_demanda,
                    fechaInicio : formatDate(fechaInicio),
                    fechaFin : formatDate(fechaFin),
                    descripcion : demanda.descripcion,
                    precio : demanda.precio,
                    estado : demanda,
                    oferta : ofertaData,
                    mascota : mascotaData,
                };
            });

            return {
                data: demandas,
                status: 200,
                ok: true,
            }
        } else {
            return {
                data: "No se encuentran demandas ",
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
