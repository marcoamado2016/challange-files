const { listService, uploadService } = require('../../aplication/recors.service')
const uploadControllers = async (req, res) => {
    return uploadService(req, res);
}
const listControllers = async (_, res) => {
    return listService(_, res);
};

module.exports = {
    listControllers,
    uploadControllers
}
