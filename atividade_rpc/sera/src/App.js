import { 
  createMovie, 
  listMoviesByCast, 
  listMoviesByGenres, 
  updateMovie
} from './funcs';
import './App.css'
import { useEffect, useState } from 'react';

const App = () => {
  const [movies, setMovies] = useState();

  const getMovies = async () => {
    const filteredMovies = await listMoviesByCast('alex');
    console.log(filteredMovies)
    setMovies(filteredMovies);
  }

  useEffect(() => {
    console.log('useeffect');
    getMovies();
  }, [])

  return <h1>teste</h1>
}

export default App;
