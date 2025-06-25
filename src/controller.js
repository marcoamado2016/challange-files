const Records = require('./records.model');
const fs = require('fs')
const upload = async (req, res) => {
    const { file } = req;
    try {
        const content = fs.readFileSync(file.path, 'utf-8');
        console.log("contenido ", content)
        return res.status(200).json({ message: 'some response', content });
    } catch (error) {
        return res.status(500).json(error)
    }

};

const list = async (_, res) => {
    try {
        const data = await Records
            .find({})
            .limit(10)
            .lean();

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = {
    upload,
    list,
};
