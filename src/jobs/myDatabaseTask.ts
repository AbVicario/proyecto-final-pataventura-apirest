import { queryRunnerCreate } from '../db/queryRunner';
import { Demanda } from '../entity/Demanda';

export const myDatabaseTask = async () => {

    const queryRunner = await queryRunnerCreate()

    const demandas = await Demanda.createQueryBuilder("demanda")
        .where("demanda.fechaFin < :date", { date: new Date() })
        .andWhere("demanda.estado = :estado", { estado: "Aceptada" })
        .getMany()

    demandas.map(async demanda => {
        demanda.estado = "Realizada"
        await demanda.save()
    })

    await queryRunner.commitTransaction()


    console.log('Tarea diaria ejecutada correctamente');
};