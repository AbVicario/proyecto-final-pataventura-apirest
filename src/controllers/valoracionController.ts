
import { queryRunnerCreate } from "../db/queryRunner";
import { Valoracion } from "../entity/Valoracion";
import { Answer } from "../models/answer";
import { Demanda } from "../entity/Demanda";
import { crearValoracion } from "../dao/valoracionDao";

export const guardarValoracion = async (c: any): Promise<Answer> => {
    const payload = await c.get('jwtPayload')
    const id_tutor = payload.id_usuario

    const body = await c.req.json()
    const id_demanda = body.id_demanda
    const queryRunner = await queryRunnerCreate()

    try {
        const demanda = await Demanda.createQueryBuilder("demanda")
            .innerJoinAndSelect("demanda.mascota", "mascota")
            .innerJoinAndSelect("mascota.tutor", "tutor")
            .where("demanda.id_demanda = :id_demanda", { id_demanda: id_demanda })
            .getOne()

        //Este codigo debería realizarse automaticamente con un job
        if (demanda.fechaFin < new Date() && demanda.estado === "Aceptada") {
            demanda.estado = "Realizada"
            await demanda.save()
        }

        if (demanda.mascota.tutor.id_usuario == id_tutor) {
            if (demanda.estado === "Cancelada por cuidador" || demanda.estado === "Realizada") {
                const existeValoracion = await Valoracion.findOne({
                    where: {
                        demanda: {
                            id_demanda: demanda.id_demanda
                        }
                    },
                    relations: ["demanda"]
                });

                if (!existeValoracion) {
                    const valoracion = await crearValoracion(body, demanda, queryRunner)
                    await queryRunner.commitTransaction()
                    if (valoracion) {
                        return {
                            data: "Valoración creada con exito",
                            status: 200,
                            ok: true
                        }
                    } else {
                        return {
                            data: "Valoración no se pudo crear",
                            status: 404,
                            ok: false
                        }
                    }
                } else {
                    return {
                        data: "Ya existe una valoración para esa demanda",
                        status: 404,
                        ok: false
                    }
                }

            } else {
                return {
                    data: " El estado de la demanda no permite valoración",
                    status: 404,
                    ok: false
                }
            }
        } else {
            return {
                data: "El tutor no corresponde con la demanda que quiere valorar",
                status: 400,
                ok: false,
            }
        }

    } catch (error) {
        await queryRunner.rollbackTransaction()
        console.log('error:', error);
        return {
            data: error.message,
            status: 400,
            ok: false,
        }
    }
    finally {
        await queryRunner.release()
    }
}

export const eliminarValoracion = async (id_valoracion: number): Promise<Answer> => {
    try {
        const valoracion = await Valoracion.findOneBy({ id_valoracion: id_valoracion })
        if (!valoracion) {
            return {
                data: "No se encontro la valoración",
                status: 404,
                ok: false
            }
        } else {
            const result = await valoracion.remove()
            if (result) {
                return {
                    data: "Valoración eliminada con exito",
                    status: 200,
                    ok: true
                }
            } else {
                return {
                    data: "Valoración no se pudo eliminar",
                    status: 404,
                    ok: false
                }
            }
        }

    } catch (error) {
        console.log('error:', error);
        return {
            data: error.message,
            status: 400,
            ok: false,
        }
    }
}

export const mostrarValoraciones = async (c: any): Promise<Answer> => {

    const id = c.req.param('id_cuidador')
    try {
        const valoraciones = await Valoracion.createQueryBuilder("valoracion")
            .innerJoinAndSelect("valoracion.demanda", "demanda")
            .innerJoinAndSelect("demanda.oferta", "oferta")
            .innerJoinAndSelect("oferta.cuidador", "cuidador")
            .innerJoinAndSelect("demanda.mascota", "mascota")
            .innerJoinAndSelect("mascota.tutor", "tutor")
            .where("cuidador.id_usuario = :id_usuario", { id_usuario: id })
            .orderBy("valoracion.id_valoracion", "DESC")
            .getMany()

        console.log(valoraciones)
        if (valoraciones) {
            const valoracionesData = valoraciones.map(valoracion => {
                const imagenTutorArray = valoracion.demanda.mascota.tutor.imagen ? Array.from(valoracion.demanda.mascota.tutor.imagen) : null;
                return {
                    id_valoracion: valoracion.id_valoracion,
                    puntuacion: valoracion.puntuacion,
                    descripcion: valoracion.descripcion,
                    alias_tutor: valoracion.demanda.mascota.tutor.alias,
                    imagen_tutor: imagenTutorArray
                };
            });
            return {
                data: valoracionesData,
                status: 200,
                ok: true,
            }
        } else {
            return {
                data: "No se encuentran valoraciones",
                status: 404,
                ok: false,
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