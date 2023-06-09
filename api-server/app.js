const express = require('express');
const server = express();
const port = 8080;
const knex = require('knex')(require('./knexfile.js')[process.env.PORT || 'development']);


server.use(express.json());
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, DELETE");
  next();
});

const movies = [];

server.get('/movies', (req, res) => {
  knex('movies')
  .then(data => res.status(200).send(data))
  .catch((err) => res.status(500).send([{message: `Error: ${err}`}]))
})



server.listen(port, () => console.log(`Server listening on port ${port}`));