import { crearMascota } from "../dao/mascotasDao";
import { setupDataSource } from "../db/connection";
import { queryRunnerCreate } from "../db/queryRunner";
import { Demanda } from "../entity/Demanda";
import { Mascota } from "../entity/Mascota";
import { Tutor } from "../entity/Tutor";
import { Answer } from "../models/answer";

export const eliminarMascota = async (c: any): Promise<Answer> => {
    const id = c.req.param('id_mascota')
    console.log('id mascota')
    const queryRunner = await queryRunnerCreate()
    try {
        const mascota = await Mascota.findOneBy({ id_mascota: id })
        console.log(mascota)
        if (!mascota) {
            return {
                data: "No existe esa mascota",
                status: 404,
                ok: false,
            }
        } else {
            if (mascota.demandas) {
                for (const demanda of mascota.demandas) {
                    if (demanda.estado.toLowerCase() == "aceptada"
                        || demanda.estado.toLowerCase() == "pendiente") {
                        demanda.estado = "cancelada_por_tutor"
                        await queryRunner.manager.save(demanda)
                    }
                }
            }

            const eliminada = await queryRunner.manager.remove(mascota)
            await queryRunner.commitTransaction()
            if (eliminada) {
                return {
                    data: "La mascota se elimino correctamente",
                    status: 200,
                    ok: true,
                }
            } else {
                return {
                    data: "La mascota no se elimino correctamente",
                    status: 404,
                    ok: false,
                }
            }
        }


    } catch (error) {
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

export const guardarMascota = async (c: any): Promise<Answer> => {
    const payload = await c.get('jwtPayload')
    console.log("guardar mascota")
    const id = payload.id_usuario
    console.log(id)
    const body = await c.req.json()
    console.log(body)
    const queryRunner = await queryRunnerCreate()

    try {
        const tutor = await Tutor.findOneBy({ id_usuario: id })

        if (!tutor) {
            return {
                data: 'No existe el tutor',
                status: 404,
                ok: false,
            }
        } else {
            const mascota = await crearMascota(body, tutor, queryRunner);
            await queryRunner.commitTransaction()

            if (!mascota) {
                return {
                    data: 'Error al crear mascota',
                    status: 422,
                    ok: false,
                }
            } else {
                return {
                    data: mascota.id_mascota,
                    status: 201,
                    ok: true,
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

export const modificarMascota = async (c: any): Promise<Answer> => {
    try {
        const body = await c.req.json();
        const id = c.req.param('id_mascota')
        const mascota = await Mascota.findOneBy({ id_mascota: id });

        if (!mascota) {
            return {
                data: "La mascota no existe",
                status: 404,
                ok: false,
            };
        } else {

            mascota.nombre = body.nombre;
            mascota.edad = body.edad;
            if (body.imagen && Array.isArray(body.imagen)) {
                try {
                    mascota.imagen = Buffer.from(body.imagen);
                } catch (error) {
                    console.error("Error al convertir los datos de la imagen a Buffer:", error);
                    mascota.imagen = null;
                }
            } else {
                mascota.imagen = null;
            }
            mascota.tamanyo = body.tamanyo;
            mascota.peso = body.peso;
            mascota.color = body.color;
            mascota.tipo = body.tipo;
            mascota.observacion = body.observacion;
            mascota.sexo = body.sexo;

            const mascotaActualizada = await mascota.save();

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
        return {
            data: error.message,
            status: 400,
            ok: false,
        };
    }
}

export const mostrarMascota = async (c: any): Promise<Answer> => {

    const id = c.req.param('id_mascota')

    try {
        const mascota = await Mascota.findOneBy({ id_mascota: id });

        if (mascota) {
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
                tutor: mascota.tutor,
                demandas: mascota.demandas
            };

            return {
                data: mascotaData,
                status: 200,
                ok: true,
            }
        } else {
            return {
                data: "No existe mascota con ese id",
                status: 404,
                ok: false,
            }
        }

    } catch (error) {
        return {
            data: error,
            status: 400,
            ok: false,
        }
    }
}

export const mostrarMascotas = async (c: any): Promise<Answer> => {
    const payload = await c.get('jwtPayload')
    const id = payload.id_usuario

    try {

        const mascotas = await Mascota.findBy({ tutor: { id_usuario: id } })

        // Convertir cada campo `imagen` de Buffer a array de bytes
        const mascotasData = mascotas.map(mascota => {
            const imagenArray = mascota.imagen ? Array.from(mascota.imagen) : null;
            return {
                id_mascota: mascota.id_mascota,
                nombre: mascota.nombre,
                num_chip: mascota.num_chip,
                edad: mascota.edad,
                imagen: imagenArray,
                tamanyo: mascota.tamanyo,
                peso: mascota.peso,
                tipo: mascota.tipo,
                raza: mascota.raza,
                color: mascota.color,
                observacion: mascota.observacion,
                sexo: mascota.sexo,
                tutor: mascota.tutor,
                demandas: mascota.demandas
            };
        });

        if (mascotasData) {
            return {
                data: mascotasData,
                status: 200,
                ok: true,
            }
        } else {
            return {
                data: "El tutor no tiene mascotas",
                status: 404,
                ok: false,
            }
        }

    } catch (error) {

        return {
            data: error,
            status: 400,
            ok: false,
        }
    }
}