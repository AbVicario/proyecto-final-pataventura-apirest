import cron from 'node-cron';
import { myDatabaseTask } from './myDatabaseTask';

var cron = require('node-cron');

cron.schedule('0 0 0 * * *', async () => {
    console.log('Ejecutando tarea diaria');
    try {
        await myDatabaseTask();
        console.log('Tarea diaria completada');
    } catch (error) {
        console.error('Error ejecutando la tarea diaria:', error);
    }
});
