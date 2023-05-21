import React, { useEffect, useState } from 'react';
// import { MovieServiceClient } from 'your-grpc-web-library';
// import { Command,  } from 'your-proto-file';
import { Command, Movie } from './generated_code/movie_pb';
import { MovieServiceClient } from './generated_code/movie_grpc_web_pb';

import { handleListByCast } from './funcs';

// const client = new MovieServiceClient('http://localhost:50051', null, null);

// const request = new Command();

// request.setMessage('cast');

// client.listMoviesByCast(request, {}, (err, response) => {
//   if (err) {
//     console.error('Erro ao criar filme:', err);
//   } else {
//     console.log('Filmes:', response);
//   }
// });

const App = () => {
  const [movies, setMovies] = useState([]);

  const teste = async () => {
    await handleListByCast(MovieServiceClient('http://127.0.0.1:80'), 'alex')
  }

  useEffect(() => {
    teste();
    // const request = new Command();
    // request.setMessage('alex');
    // console.log('request', request);

    // // Call ListMoviesByCast using gRPC
    // const stream = new client.listMoviesByCast(request, {});
    // console.log('stream', stream);

    // stream.on('data', (response) => {
    //   console.log('data', response);
    //   const movie = response.toObject();
    //   setMovies((prevMovies) => [...prevMovies, movie]);
    // });

    // stream.on('error', (err) => {
    //   console.error('Erro ao listar filmes por elenco:', err);
    // });

    // stream.on('end', () => {
    //   console.log('Listagem de filmes por elenco concluída.');
    // });

    // // When component is unmounted clear stream
    // return () => stream.cancel();
  }, []);
  

  return (
    <div>
      <h2>Movies by cast:</h2>
      {movies.length > 0 ? movies.map((movie) => (
        <div key={movie._id}>
          <h3>{movie.title}</h3>
        </div>
      )) : <h3>Error</h3>}
    </div>
  );
};

export default App;
