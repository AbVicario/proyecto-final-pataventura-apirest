import { Answer } from '../../models/answer';
import { hashPassword } from '../../utils/auth';
import { Tutor } from '../../entity/Tutor';
import { Ubicacion } from '../../entity/Ubicacion';
import { Mascota } from '../../entity/Mascota';
import { Cuidador } from '../../entity/Cuidador';
import { Oferta } from '../../entity/Oferta';
import { Cliente } from '../../entity/Cliente';
import { Usuario } from '../../entity/Usuario';
import { Perro } from '../../entity/Perro';
import { Gato } from '../../entity/Gato';

export const registroCliente = async (c: any): Promise<Answer> => {
    try {
        const usuario = new Usuario()
        const cliente = new Cliente()
        const body = await c.req.json();

        /*const usuario = new Usuario();
        usuario.email = body.email;
        usuario.password = await hashPassword(body.password);
        const usuarioCreado = await Usuario.save(usuario);*/

        //const cliente = await crearCliente(body, usuarioCreado);

        if (body.tipoCliente === "tutor") {
            const tutor = await crearTutor(body, cliente, usuario);
            await crearUbicacion(body, tutor);

            const mascota = await crearMascota(body, tutor);
            if (mascota) tutor.mascotas.push(mascota);

            await tutor.save();

            return { data: 'El tutor se ha creado con éxito', status: 200, ok: true };
        } else if (body.tipoCliente === "cuidador") {
            const cuidador = await crearCuidador(body, cliente, usuario);
            await crearOferta(body, cuidador);

            return { data: 'El cuidador se ha creado con éxito', status: 200, ok: true };
        } else {
            return { data: 'Tipo de cliente no disponible', status: 404, ok: false };
        }
    } catch (error) {
        return { data: error.message, status: 500, ok: false };
    }
};

/*async function crearCliente(body: any, usuarioCreado: Usuario): Promise<Cliente> {
    const cliente = new Cliente();
    cliente.telefono = body.telefono;
    cliente.nombre = body.nombre;
    cliente.apellido = body.apellido;
    cliente.imagen = body.imagen || "";
    cliente.alias = body.alias;
    cliente.direcciones = [];
    cliente.id_usuario = usuarioCreado.id_usuario;
    cliente.email = usuarioCreado.email;
    cliente.password = usuarioCreado.password;
    return await Cliente.save(cliente);
}*/

async function crearTutor(body: any, cliente: Cliente, usuario: Usuario): Promise<Tutor> {
    const tutor = new Tutor();
    usuario.email = body.email;
    usuario.password = await hashPassword(body.password);
    cliente.telefono = body.telefono;
    console.log(cliente.telefono);
    cliente.nombre = body.nombre;
    cliente.apellido = body.apellido;
    cliente.imagen = body.imagen || "";
    cliente.alias = body.alias;
    tutor.mascotas = [];
    tutor.valoraciones = [];
    tutor.direcciones = [];
    //tutor.id_usuario = cliente.id_usuario;
    return await Tutor.save(tutor);
}

async function crearUbicacion(body: any, tutor: Tutor): Promise<void> {
    const direccion = new Ubicacion();
    direccion.latidud = body.latidud;
    direccion.longitud = body.longitud;
    direccion.tutor = tutor;
    await Ubicacion.save(direccion);
}

async function crearMascota(body: any, tutor: Tutor): Promise<Mascota | null> {
    if (body.tipo === "perro" || body.tipo === "gato") {
        const mascota = body.tipo === "perro" ? new Perro() : new Gato();
        mascota.nombre = body.nombre_mascota;
        mascota.edad = body.edad || 0;
        mascota.imagen = body.imagen_mascota || "";
        mascota.tamanyo = body.tamanyo || 0;
        mascota.peso = body.peso || 0;
        mascota.color = body.color;
        mascota.tipo = body.tipo;
        mascota.observacion = body.observacion || "";
        mascota.tutor = tutor;
        mascota.demandas = [];
        mascota.raza = body.raza || "";
        console.log(mascota+"kkkkkkkkkkk")
        return await mascota.save();
    }
    return null;
}

async function crearCuidador(body: any, cliente: Cliente, usuario: Usuario): Promise<Cuidador> {
    const cuidador = new Cuidador();
    usuario.email = body.email;
    usuario.password = await hashPassword(body.password);
    cliente.telefono = body.telefono;
    cliente.nombre = body.nombre;
    cliente.apellido = body.apellido;
    cliente.imagen = body.imagen || "";
    cliente.alias = body.alias;
    cuidador.demandas = [];
    cuidador.valoraciones = [];
    //cuidador.id_usuario = cliente.id_usuario;
    return await Cuidador.save(cuidador);
}

async function crearOferta(body: any, cuidador: Cuidador): Promise<void> {
    const oferta = new Oferta();
    oferta.tipo = body.tipoOferta;
    oferta.descripcion = body.descripcion;
    oferta.precio = body.precio;
    oferta.cuidador = cuidador;
    await Oferta.save(oferta);
}
