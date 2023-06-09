import './App.css';
import {useState, useEffect} from 'react';

function App() {

  const [movies, setMovies] = useState([]);
  const [searchString, setSearchString] = useState('');

  //TODO - make this more robust to errors, show different messages for different status codes
  useEffect(() => {
    fetch('http://localhost:8080/movies')
    .then(res => res.json())
    .then(data => setMovies(data))
    .catch(err => console.error(err));
  }, [])


  return (
    <div className="App">
      <input type="text" placeholder="search" value={searchString} onChange={(e) => setSearchString(e.target.value)}></input>
      <ul>
        {movies.length >= 0 && (
          searchString
          ?
          movies.filter(movie => movie?.title?.includes(searchString)).map((movie, index) => <li key={index}>{movie.title}</li>)
          :
          movies.map((movie, index) => <li key={index}>{movie.title}</li>)
        )}
      </ul>
    </div>
  );
}

export default App;
