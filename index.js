const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const server = express();

server.use(express.json());
server.use(helmet());

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lamdba.sqlite3"
  },
  debug: true
};

const db = knex(knexConfig);

// endpoints here

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
