import { Command } from './generated_code/movie_pb';
import { MovieServiceClient } from './generated_code/movie_grpc_web_pb';

const client = new MovieServiceClient('http://localhost:50051');

// Função para criar um filme
export const createMovie = (movie) => {
  return new Promise((resolve, reject) => {
    client.createMovie(movie, {}, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};

// Função para listar filmes por elenco
export const listMoviesByCast = (cast) => {
  return new Promise((resolve, reject) => {
    const command = new Command();
    command.setMessage(cast);
    console.log('command', command)
    const stream = client.listMoviesByCast(command, {});
    const movies = [];

    stream.on('data', (movie) => {
      movies.push(movie);
    });

    stream.on('error', (err) => {
      reject(err);
    });

    stream.on('end', () => {
      resolve(movies);
    });
  });
};

// Função para listar filmes por gêneros
export const listMoviesByGenres = (genres) => {
  return new Promise((resolve, reject) => {
    const command = new Command();
    command.setMessage(JSON.stringify(genres));
    const stream = client.listMoviesByGenres(command, {});
    const movies = [];

    stream.on('data', (movie) => {
      movies.push(movie);
    });

    stream.on('error', (err) => {
      reject(err);
    });

    stream.on('end', () => {
      resolve(movies);
    });
  });
};

// Função para atualizar um filme
export const updateMovie = (movie) => {
  return new Promise((resolve, reject) => {
    client.updateMovie(movie, {}, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};

// // Função para excluir um filme
// export const deleteMovie = (id: number): Promise<Response> => {
//   return new Promise((resolve, reject) => {
//     const command = new Command();
//     command.setMessage(id.toString());
//     client.deleteMovie(command, (err: any, response: any) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(response);
//       }
//     });
//   });
// };
