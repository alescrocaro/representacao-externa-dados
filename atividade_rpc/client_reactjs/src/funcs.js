import { MovieServiceClient } from './generated_code/movie_grpc_web_pb';
import proto from './generated_code/movie_pb';

const client = new MovieServiceClient('http://localhost:50051');

/**
 * list movies by cast
 * @param {string[]} cast 
 */
const listMoviesByCast = (cast) => {
  const command = new proto.teste.Command();
  command.setMessage(cast);

  const stream = client.listMoviesByCast(command, {});

  stream.on('data', (movie) => {
    // processa cada filme recebido
    console.log('Received movie:', movie.toObject());
  });

  stream.on('error', (err) => {
    // trata erros
    console.error('Error:', err);
  });

  stream.on('end', () => {
    // finaliza fluxo de dados
    console.log('Streaming completed');
  });
};

const cast = 'John Doe';
listMoviesByCast(cast);
