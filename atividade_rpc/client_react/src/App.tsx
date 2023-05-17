import { 
  createMovie, 
  listMoviesByCast, 
  listMoviesByGenres, 
  updateMovie
} from './funcs';
import './App.css'
import { useState } from 'react';
import { Movie } from './generated_code/movie_pb';

const App = () => {
  const [movies, setMovies] = useState<Movie[]>();

  const getMovies = async () => {
    const filteredMovies = await listMoviesByCast('alex');
    console.log(filteredMovies)
    setMovies(filteredMovies);
  }

  return <h1>teste</h1>
}

export default App;
