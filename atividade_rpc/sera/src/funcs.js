import { Command } from './generated_code/movie_pb';
import { MovieServiceClient } from './generated_code/movie_grpc_web_pb';

const client = new MovieServiceClient('http://localhost:80');
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


  // ~~~~~ ListByActor (stream do servidor) ~~~~
export async function handleListByCast(stub, nameActor){    
  await new Promise((resolve, reject) => {
      // console.log('styvb', stub)
      //chama funcao read do stub, com Msg de parametro

      const command = new Command();

      command.setMessage(nameActor)

      var call = client.listMoviesByCast(command);       
      console.log('call', call)

      //fica recebendo movie em stream
      call.on('data', (Movie) => {            
          console.log('\n==================== Movie ====================\n')
          console.log(Movie);
      });
      
      //é chamado quando o servidor termina de mandar os movie
      call.on('end', () => {                  
          console.log('*** end ***')
          resolve()
      });
      
      //em caso de erro
      call.on('error', (e) => {
          console.log('*** error ***', e)
          reject(e)
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
