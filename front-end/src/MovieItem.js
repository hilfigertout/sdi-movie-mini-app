import { useState, useContext } from "react";
import AppContext from "./AppContext";

const MovieItem = ({movie}) => {

  const {watchedMovieIds, setWatchedMovieIds, getTrigger, setGetTrigger, movies, setShowMovieId} = useContext(AppContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const watched = watchedMovieIds.includes(movie.id);

  const deleteMovie = () => {
    setButtonLoading(true);
    fetch(`http://localhost:8080/movies/${movie.id}`, {method: 'DELETE'})
    .then(res => {
      if (res.status === 200) {
        console.log('Successfully deleted');
        setWatchedMovieIds(watchedMovieIds.filter((movieId) => movieId !== movie.id))
        setGetTrigger(!getTrigger);
      } else {
        console.log('Not deleted');
      }
    })
    .finally(() => {
      setButtonLoading(false);
    })
  }



  return (
  <div>
    <h2 onClick={() => setShowMovieId(movie.id)}>{movie.title}</h2>
    {watched ? <h4>Watched</h4> : <h4>To Watch</h4>}
    {<button className="delete-movie" disabled={buttonLoading} onClick={deleteMovie}>Delete</button>}
  </div>
  )
}

export default MovieItem;