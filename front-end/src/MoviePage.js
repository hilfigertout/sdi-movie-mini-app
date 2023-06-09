import {useState, useEffect, useContext} from 'react';
import AppContext from './AppContext';


const MoviePage = () => {
  
  const {watchedMovieIds, setWatchedMovieIds, getTrigger, setGetTrigger, movies, showMovieId, setShowMovieId} = useContext(AppContext);
  const [movieData, setMovieData] = useState(movies.find((movie) => movie.id === showMovieId));
  const [watched, setWatched] = useState(watchedMovieIds.includes(movieData.id));
  const [buttonLoading, setButtonLoading] = useState(false);

  const toggleWatched = () => {
    setButtonLoading(true);
    if (watched) {
      setWatchedMovieIds(watchedMovieIds.filter((movieId) => movieId !== movieData.id))
    } else {
      setWatchedMovieIds([...watchedMovieIds, movieData.id])
    }
    setWatched(!watched);
    setButtonLoading(false);
  }

  useEffect(() => {
    fetch(`http://localhost:8080/movies/api/${movieData.title}`)
    .then(res => res.json())
    .then(data => {
      if (data.total_results > 0) {
        setMovieData({...data.results[0], ...movieData});
      }
    })
    .catch(err => console.log(err))
  }, [])


  return (
  <div className="movie-page">
    <button onClick={() => setShowMovieId(-1)}>Back to List</button>
    <h1>Movie Page</h1>
    <h1>{movieData.title}</h1>
    {watchedMovieIds.includes(movieData.id) 
    ? 
    <button className="watched-button" disabled={buttonLoading} onClick={toggleWatched}>Watched</button> 
    : 
    <button className="to-watch-button" disabled={buttonLoading} onClick={toggleWatched}>To Watch</button>}
    
    {movieData.poster_path && <img src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`} alt={`Poster for ${movieData.title}`} />}
    {movieData.release_date && <p>Release Date: {movieData.release_date}</p>}

    <footer>
      <p>External Movie data courtesey of:</p>
      <img className="moviedb-logo" src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" alt="The Movie Database logo"/>
    </footer>
  </div> 
  );
}
 
export default MoviePage;