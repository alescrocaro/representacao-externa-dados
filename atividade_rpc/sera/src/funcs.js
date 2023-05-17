import { Command } from './generated_code/movie_pb';
import { MovieServiceClient } from './generated_code/movie_grpc_web_pb';

const client = new MovieServiceClient('http://localhost:50051');
console.log('client', client)

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

export const listMoviesByCast = (cast) => {
  return new Promise((resolve, reject) => {
    const command = new Command();
    command.setMessage(cast);
    console.log('command', command)
    console.log('client', client)
    const stream = client.listMoviesByCast(command, {});
    console.log('stream', stream);
    const movies = [];

    stream.on('data', (movie) => {
      movies.push(movie);
      console.log('teste', movie)
    });

    stream.on('error', (err) => {
      reject(err);
    });

    stream.on('end', () => {
      resolve(movies);
    });
  });
};

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
