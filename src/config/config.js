import dotenv from 'dotenv';
const program = require('../utils/commander.js');

const { mode } = program.opts();

dotenv.config({
    path: mode === "produccion" ? "./.env.production" : "./.env.development"
});

const configObject = {
    puerto: process.env.PUERTO,
    mongo_url: process.env.MONGO_URL,
    session_secret: process.env.SESSION_SECRET
};

module.exports = configObject;