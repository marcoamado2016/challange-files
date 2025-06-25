require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const connecionDB = async () => {
    const mongoDB = process.env.MONGODB_URL;
    const options = {
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        connectTimeoutMS: 30000,
        autoIndex: false,
        socketTimeoutMS: 30000,
    };

    if (process.env.MONGODB_USER) {
        options.user = process.env.MONGODB_USER;
        options.pass = process.env.MONGODB_PASSWORD;
    }

    if (process.env.MONGODB_AUTHDB) {
        options.authSource = process.env.MONGODB_AUTHDB;
    }

    mongoose.set('strictQuery', false);

    mongoose.connect(mongoDB, options);
    mongoose.Promise = global.Promise;
    const db = mongoose.connection;
    db.on('error', (err) => console.error(err));
}
module.exports = { connecionDB }