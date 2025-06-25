const Records = require('../domain/records.model');
const { parse, Parser } = require('csv-parse');
const fs = require('fs');
const { Response } = require('../domain/enumRespuesta');
/**
 * 
 * @param {*} req se envia el archivo con el nombre file
 * @param {*} res
 * @method {*} Lee un archivo sin almacenar en la ram para procesar en lote y el restante
 * @returns un 200 si la carga de los dato es exitoso 
 */
const uploadService = async (req, res) => {
    const { file } = req;
    try {
        const records = parseColumns();

        const stream = fs.createReadStream(file.path).pipe(records);
        processLot(stream, res);
        processRest(stream, res)
        return res.status(Response.PROCESADO).json({
            message: 'Carga finalizada'
        });
    } catch (error) {
        return res.status(Response.INTERNAL_SERVER_ERROR).json({ message: error })
    }
}
const listService = async (_, res) => {
    try {
        const data = await Records
            .find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        return res.status(Response.PROCESADO).json({ message: "Listado OK" });
    } catch (err) {
        return res.status(Response.INTERNAL_SERVER_ERROR).json({ message: err });
    }
};
/**
 * Parseo los datos del archivo separados en coma con los campos indicados
 * @returns 
 */
const parseColumns = () => {
    const records = parse({
        columns: ['id', 'firstname', 'lastname', 'email', 'email2', 'profession'],
        skip_empty_lines: true
    });
    return records;
}
/**
 * 
 * @param {*} stream se procesa por lotes de 10000 y se inserta en la base de datos
 */
const processLot = (stream, res) => {
    const BATCH_SIZE = 10000;
    let buffer = [];
    try {
        stream.on('data', async (row) => {
            buffer.push(row);
            if (buffer.length >= BATCH_SIZE) {
                stream.pause();

                await Records.insertMany(buffer, { ordered: false });

                buffer = [];
                stream.resume();

            }
        })
    } catch (error) {
        return res.status(Response.INTERNAL_SERVER_ERROR).json({ message: err });
    }
}
/**
 * Si no llega al lote del 10000 se procesa y guarda en la base
 */
const processRest = (stream, res) => {
    let buffer = [];
    try {
        stream.on('end', async () => {
            if (buffer.length > 0) {
                await Records.insertMany(buffer, { ordered: false });
            }
        });
    } catch (err) {
        return res.status(Response.INTERNAL_SERVER_ERROR).json({ message: err });
    }
}
module.exports = {
    uploadService,
    listService,
};
