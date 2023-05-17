import { useEffect, useState } from 'react'
import './App.css'
import movie_grpc_web_pb from './generated_code/movie_grpc_web_pb';
import movie_pb from './generated_code/movie_pb';


function App() {
  const [movies, setMovies] = useState();
  const client = new MovieServiceClient('http://localhost:50051');
  // const listMoviesByCast = (cast) => {
  //   const command = new proto.teste.Command();
  //   command.setMessage(cast);

  //   const stream = client.listMoviesByCast(command, {});

  //   stream.on('data', (movie) => {
  //     // processa cada filme recebido
  //     console.log('Received movie:', movie.toObject());
  //   });

  //   stream.on('error', (err) => {
  //     // trata erros
  //     console.error('Error:', err);
  //   });

  //   stream.on('end', () => {
  //     // finaliza fluxo de dados
  //     console.log('Streaming completed');
  //   });
  // };
  const listMoviesByCast = async (cast) => {
    const command = new proto.teste.Command();
    command.setMessage(cast);
  
    try {
      const stream = client.listMoviesByCast(command, {});
  
      for await (const movie of stream) {
        // Lógica para processar cada filme recebido
        console.log('Received movie:', movie.toObject());
      }
  
      console.log('Streaming completed');
    } catch (error) {
      // Lógica para tratar erros
      console.error('Error:', error);
    }
  };

  const getMovies = async () => {
    const filteredMovies = await listMoviesByCast('alex');
    console.log(filteredMovies)
    console.log(movies)
    setMovies(filteredMovies);
  }

  useEffect(() => {
    getMovies();
  }, [])
  return <h1>teste</h1>

}

export default App
