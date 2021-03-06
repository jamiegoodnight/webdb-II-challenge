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

// --- GET all zoos

server.get("/api/zoos/", (req, res) => {
  db("zoos")
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      res.status(500).json({ message: "There was a problem retrieving zoos!" });
    });
});

// --- GET zoo with specified ID

server.get("/api/zoos/:id", (req, res) => {
  zooID = req.params.id;
  db("zoos")
    .first()
    .where({ id: zooID })
    .then(zoo => {
      if (zoo) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ message: "This zoo could not be found!" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "There was a problem retrieving this zoo!" });
    });
});

// --- POST a zoo

server.post("/api/zoos/", (req, res) => {
  if (req.body.name) {
    db("zoos")
      .insert(req.body)
      .then(ids => {
        const id = ids[0];
        db("zoos")
          .first()
          .where({ id })
          .then(zoo => {
            res.status(200).json(zoo);
          });
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "There was a problem posting this zoo!" });
      });
  } else {
    res.status(404).json({ message: "Please provide a name for this zoo!" });
  }
});

// --- PUT to update existing zoo

server.put("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "This zoo could not be found!" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "There was a problem updating this zoo!" });
    });
});

// --- DELETE a zoo

server.delete("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "This zoo could not be found!" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "There was a problem deleting this zoo!" });
    });
});

// endpoints here

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
