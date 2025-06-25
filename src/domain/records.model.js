/* eslint-disable max-len */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
    id: String,
    firstname: String,
    lastname: String,
    email: String,
    email2: String,
    profession: String,

}, { timestamps: true });

module.exports = mongoose.model('records', schema);
