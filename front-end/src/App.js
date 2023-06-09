import './App.css';
import {useState, useEffect} from 'react';
import useLocalStorageState from './useLocalStorageState';
import MovieItem from './MovieItem';
import MoviePage from './MoviePage';
import AppContext from './AppContext';

function App() {


  const [getTrigger, setGetTrigger] = useState(false)
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [watchedMovieIds, setWatchedMovieIds] = useLocalStorageState([], 'watchedMovieIds');
  const [movies, setMovies] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [showMovieId, setShowMovieId] = useState(-1);

  

  //TODO - make this more robust to errors, show different messages for different status codes
  useEffect(() => {
    fetch('http://localhost:8080/movies')
    .then(res => res.json())
    .then(data => setMovies(data))
    .catch(err => console.error(err));
  }, [getTrigger])

  const createNewMovie = (e) => {
    e.preventDefault()
    setLoadingCreate(true);
    if (inputTitle) {
      const newMovie = {title: inputTitle};
      fetch('http://localhost:8080/movies', {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(newMovie)})
      .then(res => {
        if (res.status === 201) {
          console.log('Successfully added');
          setGetTrigger(!getTrigger);
          setInputTitle('');
        } else {
          console.log('Failed to add movie');
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingCreate(false);
      })
    } else {
      setLoadingCreate(false);
    }
  }

  const contextObject = {watchedMovieIds, setWatchedMovieIds, getTrigger, setGetTrigger, movies, showMovieId, setShowMovieId}


  return (
    <div className="App">
      <AppContext.Provider value={contextObject}>
        {
        showMovieId >= 0 
        ?
          <MoviePage />
        :
          <>
            <input type="text" placeholder="search" value={searchString} onChange={e => setSearchString(e.target.value)} />
            <form className="new-movie">
              <input type="text" placeholder="New Movie" label="new" value={inputTitle} onChange={e => setInputTitle(e.target.value) }/>
              <button disabled={loadingCreate} onClick={createNewMovie}>Add Movie</button>
            </form>
            <div className="movie-list">
              {
                searchString
                ?
                movies.filter(movie => movie.title.toLowerCase().includes(searchString.toLowerCase())).map((movie, index) => <MovieItem movie={movie} key={index}/>)
                :
                movies.map((movie, index) => <MovieItem movie={movie} key={index}/>)
              }
            </div>
          </>
        }
      </AppContext.Provider>
    </div>
  );
}

export default App;
