
import { Answer } from "../models/answer"
import { sign } from 'hono/jwt'
import { verfifyPassword } from "../utils/auth"
import { Cuidador } from "../entity/Cuidador"
import { Tutor } from "../entity/Tutor"
import { crearTutor } from "../dao/tutorDao"
import { crearCuidador } from "../dao/cuidadorDao"
import { queryRunnerCreate } from "../db/queryRunner"

export const loginCuidador = async (c: any): Promise<Answer> => {

    const body = (await c.req.json())

    const cuidador = await Cuidador.findOneBy({
        email: body.email
    })

    if (!cuidador) {
        return {
            data: 'Email no encontrado',
            status: 401,
            ok: false,
        }
    }

    const verifyPassword = await verfifyPassword(
        body.password,
        cuidador.password
    )

    if (!verifyPassword) {
        return {
            data: 'Invalid credentials',
            status: 422,
            ok: false,
        }
    }

    const cuidadorAutenticado = {
        id_usuario: cuidador.id_usuario,
        tipo: "Cuidador",
    }

    const token = await sign(cuidadorAutenticado, process.env.JWT_SECRET!!)

    return {
        data: {
            token,
        },
        status: 200,
        ok: true,
    }
}

export const loginTutor = async (c: any): Promise<Answer> => {

    const body = (await c.req.json())

    const tutor = await Tutor.findOneBy({
        email: body.email
    })
    if (!tutor) {
        return {
            data: 'Email no encontrado',
            status: 401,
            ok: false,
        }
    }

    const verifyPassword = await verfifyPassword(
        body.password,
        tutor.password
    )
    console.log(verifyPassword)
    if (!verifyPassword) {
        return {
            data: 'Invalid credentials',
            status: 422,
            ok: false,
        }
    }

    const tutorAutenticado = {
        id_usuario: tutor.id_usuario,
        tipo: "Tutor"
    }

    const token = await sign(tutorAutenticado, process.env.JWT_SECRET!!)
    console.log(token)
    return {
        data: {
            token,
        },
        status: 200,
        ok: true,
    }
}
//Haciendo pruebas del registro descubrí que se insertaba el objeto tutor sin mascota.
// Lo arreglé modificando el controlador añadiendo un rollback a la transaccion con los recursos que me da typeORM 
export const registroTutor = async (c: any): Promise<Answer> => {

    const queryRunner = await queryRunnerCreate()

    try {
        const body = await c.req.json();
        const tutor = await crearTutor(body, queryRunner);
        //await crearUbicacionTutor(body, tutor, queryRunner);


        //const mascota = await crearMascota(body, tutor, queryRunner);

        //if (mascota) tutor.mascotas.push(mascota);
        await queryRunner.commitTransaction()
        return { data: tutor.id_usuario, status: 200, ok: true };

    } catch (error) {
        await queryRunner.rollbackTransaction()
        return { data: error.message, status: 500, ok: false }

    } finally {
        await queryRunner.release()
    }
};

export const getCuidador = async (c: any): Promise<Answer> => {
    try {
        const payload = await c.get('jwtPayload');
        console.log("Payload:", payload);

        const id_cuidador = payload.id_usuario;

        const cuidador = await Cuidador.findOneBy({ id_usuario: id_cuidador });

        const cuidadorData = {
            idUsuario: cuidador.id_usuario,
            email: cuidador.email,
            password: cuidador.password,
            telefono: cuidador.telefono,
            nombre: cuidador.nombre,
            apellido: cuidador.apellido,
            imagen: cuidador.imagen ? Array.from(cuidador.imagen) : null,
            alias: cuidador.alias,
            direccion: cuidador.direccion
        }

        return { data: cuidadorData, status: 200, ok: true };
    } catch (error) {
        console.error("Error:", error);
        return { data: error.message, status: 500, ok: false };
    }
};

export const getTutor = async (c: any): Promise<Answer> => {
    try {
        const payload = await c.get('jwtPayload');
        console.log("Payload:", payload);

        const id_tutor = payload.id_usuario;
        console.log("pinta", id_tutor)

        const tutor = await Tutor.findOneBy({ id_usuario: id_tutor });

        const tutorData = {
            idUsuario: tutor.id_usuario,
            email: tutor.email,
            password: tutor.password,
            telefono: tutor.telefono,
            nombre: tutor.nombre,
            apellido: tutor.apellido,
            imagen: tutor.imagen ? Array.from(tutor.imagen) : null,
            alias: tutor.alias,
            direccion: tutor.direccion
        }

        return { data: tutorData, status: 200, ok: true };
    } catch (error) {
        console.error("Error:", error);
        return { data: error.message, status: 500, ok: false };
    }
};

export const registroCuidador = async (c: any): Promise<Answer> => {
    const queryRunner = await queryRunnerCreate()
    try {

        const body = await c.req.json();
        console.log(body)
        const cuidador = await crearCuidador(body, queryRunner);

        //await crearUbicacionCuidador(body, cuidador, queryRunner);

        //const oferta = await crearOferta(body, cuidador, queryRunner);
        //if (oferta) cuidador.ofertas.push(oferta)
        await queryRunner.commitTransaction()
        return { data: cuidador.id_usuario, status: 200, ok: true };

    } catch (error) {
        await queryRunner.rollbackTransaction()
        return { data: error.message, status: 500, ok: false };
    } finally {
        await queryRunner.release()
    }
};

export const mostrarCuidadores = async (c: any): Promise<Answer> => {
    const tipo = c.req.param('tipo')
    try {
        const cuidadores = await Cuidador.createQueryBuilder("cuidador").innerJoin("cuidador.ofertas", "oferta").where("oferta.tipo = :tipo", { tipo }).getMany()

        //Acordarse de transformar las imagenes a byteArray(como en getMascotas)
        const cuidadoresData = cuidadores.map(cuidador => {
            const imagenArray = cuidador.imagen ? Array.from(cuidador.imagen) : null;
            return {
                idUsuario: cuidador.id_usuario,
                email: cuidador.email,
                password: cuidador.password,
                telefono: cuidador.telefono,
                nombre: cuidador.nombre,
                apellido: cuidador.apellido,
                imagen: imagenArray,
                alias: cuidador.alias,
                direccion: cuidador.direccion
            };
        });
        if (cuidadoresData.length <= 0) {
            return {
                data: "No se encuentran cuidadores del tipo: " + tipo,
                status: 404,
                ok: false
            }
        } else {
            return {
                data: cuidadoresData,
                status: 200,
                ok: true
            }
        }
    } catch (error) {
        return { data: error.message, status: 500, ok: false };
    }
}

export const updateTutor = async (c: any): Promise<Answer> => {
    try {
        console.log('entra en update tutor')
        const body = await c.req.json();
        const id = c.req.param('id_tutor')
        const tutor = await Tutor.findOneBy({ id_usuario: id });

        if (!tutor) {
            console.log('tutor no existe')
            return {
                data: "El tutor no existe",
                status: 404,
                ok: false,
            };
        } else {

            tutor.alias = body.alias;
            tutor.telefono = body.telefono;
            tutor.email = body.email;
            tutor.direccion = body.direccion;
            if (body.imagen && Array.isArray(body.imagen)) {
                try {
                    tutor.imagen = Buffer.from(body.imagen);
                } catch (error) {
                    console.error("Error al convertir los datos de la imagen a Buffer:", error);
                    tutor.imagen = null;
                }
            } else {
                tutor.imagen = null;
            }

            const tutorActualizado = await tutor.save();
            console.log(tutorActualizado)

            if (tutorActualizado) {
                const tutorData = {
                    idUsuario: tutorActualizado.id_usuario,
                    email: tutorActualizado.email,
                    password: tutorActualizado.password,
                    telefono: tutorActualizado.telefono,
                    nombre: tutorActualizado.nombre,
                    apellido: tutorActualizado.apellido,
                    imagen: tutorActualizado.imagen ? Array.from(tutorActualizado.imagen) : null,
                    alias: tutorActualizado.alias,
                    direccion: tutorActualizado.direccion
                }
                console.log("TutorData = " + tutorData.idUsuario)

                return {
                    data: tutorData,
                    status: 200,
                    ok: true,
                };
            } else {
                return {
                    data: "El tutor no se puede actualizar",
                    status: 404,
                    ok: false,
                };
            }
        }

    } catch (error) {
        console.log('error:', error);
        return {
            data: error.message,
            status: 500,
            ok: false,
        };
    }
}

export const updateCuidador = async (c: any): Promise<Answer> => {
    try {
        const body = await c.req.json();
        const id = c.req.param('id_cuidador')
        const cuidador = await Cuidador.findOneBy({ id_usuario: id });

        if (!cuidador) {
            return {
                data: "El cuidador no existe",
                status: 404,
                ok: false,
            };
        } else {

            cuidador.alias = body.alias;
            cuidador.telefono = body.telefono;
            cuidador.email = body.email;
            cuidador.direccion = body.direccion;
            if (body.imagen && Array.isArray(body.imagen)) {
                try {
                    cuidador.imagen = Buffer.from(body.imagen);
                } catch (error) {
                    cuidador.imagen = null;
                }
            } else {
                cuidador.imagen = null;
            }

            const cuidadorActualizado = await cuidador.save();

            if (cuidadorActualizado) {
                const cuidadorData = {
                    idUsuario: cuidadorActualizado.id_usuario,
                    email: cuidadorActualizado.email,
                    password: cuidadorActualizado.password,
                    telefono: cuidadorActualizado.telefono,
                    nombre: cuidadorActualizado.nombre,
                    apellido: cuidadorActualizado.apellido,
                    imagen: cuidadorActualizado.imagen ? Array.from(cuidadorActualizado.imagen) : null,
                    alias: cuidadorActualizado.alias,
                    direccion: cuidadorActualizado.direccion
                }

                return {
                    data: cuidadorData,
                    status: 200,
                    ok: true,
                };
            } else {
                return {
                    data: "El cuidador no se puede actualizar",
                    status: 404,
                    ok: false,
                };
            }
        }

    } catch (error) {
        console.log('error:', error);
        return {
            data: error.message,
            status: 500,
            ok: false,
        };
    }
}


