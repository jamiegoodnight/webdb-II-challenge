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
    filename: "./data/lambda.sqlite3"
  },
  debug: true
};

const db = knex(knexConfig);

server.get("/api/zoos/", (req, res) => {
  db("zoos")
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get("/api/zoos/:id", (req, res) => {
  zooID = req.params.id;
  db("zoos")
    .first()
    .where({ id: zooID })
    .then(zoo => {
      res.status(200).json(zoo);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// endpoints here

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
