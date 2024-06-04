import { Command } from "commander";

const program = new Command();

// 1 - Comando // 2 - La descripción // 3 - Valor por defecto
program
    .option("-p <port>", "puerto en donde se inicia el servidor", 8080)
    .option("--mode <mode>", "modo de trabajo", "produccion")
program.parse();

// Obtener las opciones
const options = program.opts();

// Imprimir el mensaje con el puerto y el modo
console.log(`Aplicación funcionando en el puerto ${options.p} en modo ${options.mode}`);

module.exports = program;

