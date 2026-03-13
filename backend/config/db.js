const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'db', 
    user: 'root',
    password: 'root',
    database: 'psu_bus_db'
});

module.exports = pool;