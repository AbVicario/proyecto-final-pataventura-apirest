
import { QueryRunner } from "typeorm";
import { setupDataSource } from "./connection";

export async function queryRunnerCreate(): Promise<QueryRunner> {
    const dataSource = await setupDataSource()
    await dataSource.initialize()
    const queryRunner = dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    return queryRunner
}