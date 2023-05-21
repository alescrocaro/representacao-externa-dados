import { Command } from './generated_code/movie_pb';
import { MovieServiceClient } from './generated_code/movie_grpc_web_pb';

const client = new MovieServiceClient('http://127.0.0.1:8000');
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


export async function handleListByCast(stub, nameActor){    
  await new Promise((resolve, reject) => {
      const command = new Command();
      command.setMessage(nameActor)

      var call = client.listMoviesByCast(command);       
      call.on('data', (movie) => {            
          console.log(movie);
      });
      
      call.on('end', () => {                  
          console.log('end');
          resolve();
      });
      
      //em caso de erro
      call.on('error', (e) => {
          console.log('error', e);
          reject();
      });
  })
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
