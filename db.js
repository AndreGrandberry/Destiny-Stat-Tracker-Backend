// Database for metrics and users

const { Pool } = require("pg");
const {  DB_URI } = require("./config");

require("dotenv").config();

const pool = new Pool({
    connectionString: DB_URI
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to PostgreSQL database:', err));



module.exports = pool;

