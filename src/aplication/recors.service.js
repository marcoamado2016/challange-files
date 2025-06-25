const Records = require('../domain/records.model');
const { parse, Parser } = require('csv-parse');
const fs = require('fs')
const uploadService = async (req, res) => {
    const { file } = req;
    try {
        const records = parseColumns();

        const stream = fs.createReadStream(file.path).pipe(records);
        processLot(stream);
        processRest(stream);
        stream.on('end', async () => {
            if (buffer.length > 0) {
                try {
                    await Records.insertMany(buffer, { ordered: false });
                } catch (err) {
                    return res.status(500).json(error)
                }
            }

        });
        return res.status(200).json({
            message: 'Carga finalizada'
        });
    } catch (error) {
        console.log("error ", error)
        return res.status(500).json(error)
    }

}
const listService = async (_, res) => {
    try {
        const data = await Records
            .find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const parseColumns = () => {
    const records = parse({
        columns: ['id', 'firstname', 'lastname', 'email', 'email2', 'profession'],
        skip_empty_lines: true
    });

    return records;
}
const processLot = (stream) => {
    const BATCH_SIZE = 10000;
    let buffer = [];
    stream.on('data', async (row) => {
        buffer.push(row);
        if (buffer.length >= BATCH_SIZE) {
            stream.pause();
            try {
                await Records.insertMany(buffer, { ordered: false })
            } catch (error) {

            }
            buffer = [];
            stream.resume();
        }
    })
}

const processRest = (stream) => {
    let buffer = [];
    stream.on('end', async () => {
        if (buffer.length > 0) {
            try {
                await Records.insertMany(buffer, { ordered: false });
            } catch (err) {
                return res.status(500).json(error)
            }
        }

    });
}
module.exports = {
    uploadService,
    listService,
};
