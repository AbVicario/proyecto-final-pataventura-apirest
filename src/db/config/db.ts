import { Client } from 'pg';
require('dotenv').config();

var con = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Conectado a PostgreSQL");
});

module.exports = con;