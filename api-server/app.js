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

server.get('/movies/api/:title', (req, res) => {

  const title = req.params.title
  console.log(title);
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${title}&include_adult=false&language=en-US&page=1`)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    res.status(200).send(data);
  })
  .catch(err => console.error(err));
})

server.post('/movies', (req, res) => {
  const newMovie = req.body
  knex('movies')
    .insert(newMovie, ['*'])
    .then(person => {
      res.status(201).send(person);
    })
    .catch(err => {
      res.status(500).send({message: `Server error: ${err}`});
    })
})

server.delete('/movies/:id', (req, res) => {
  knex('movies')
    .where('id', req.params.id)
    .del(['*'])
    .then(person => {
      res.status(200).send(`Deleted movie with id ${req.params.id}`);
    })
    .catch(err => {
      res.status(500).send(err)
    })
})



server.listen(port, () => console.log(`Server listening on port ${port}`));