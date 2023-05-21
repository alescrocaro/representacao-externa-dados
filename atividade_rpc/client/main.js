/**
  Make connection with server, receive user inputs by terminal, make API calls (CRUD) based on user inputs, assure user don't send empty fields of movies. 

  Author: Alexandre Aparecido Scrocaro Junior, Pedro Klayn
  Dates: 
    start: 02/05/2023
    more info: https://github.com/alescrocaro/representacao-externa-dados
 */

const prompt = require('prompt-sync')();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Movie, Command } = require('./movie_pb');

const accepted_commands = ['create', 'listByCast', 'listByGenres', 'update', 'delete']

var global_movie_name = undefined;

let PORT = 52515
PORT = 50051

/**
 * connect function with API, then calls main function
 */
// client.connect(PORT, '127.0.0.1', () => {
//     console.log('Connection established with server.');
//     console.log("You can use the following commands:");
//     console.log('> create');
//     console.log('> list');
//     console.log('> update');
//     console.log('> delete');
//     console.log('> close');
//     main();
// });

/**
 * Get information to create or update a movie. does not let user leave a field empty.
 * If user is updating a movie, shows the movie name.
 * @param {boolean} isUpdating: user is updating a movie 
 * @returns {Uint8Array} with information about the movie
 */
const getCreateOrUpdateData = (isUpdating) => {
  // console.log('getCreateOrUpdateData')
  let new_title = isUpdating ? isUpdating : '';
  let new_cast = '';
  let new_genres = '';
  let new_runtime = '';
  let new_year = '';
  let filled_fields = 0;
  if (isUpdating) {
    console.log('updating movie: ', new_title);
    filled_fields += 1;
  }
  while (true) {
    if (filled_fields == 0 && !isUpdating) {
      const title = prompt('title: ').trim();
      if (title === '') {
        console.log('The movie must have a title');
        continue;
      }
      filled_fields += 1;
      new_title = title;
    }

    if (filled_fields == 1) {
      const cast = prompt("cast (if more than one split with ','): ").trim();
      if (cast === '') {
        console.log('The movie must have a cast');
        continue;
      }
      filled_fields += 1;
      new_cast = cast;
    }

    if (filled_fields == 2) {
      const genres = prompt("genres (if more than one split with ','): ").trim();
      if (genres === '') {
        console.log('The movie must have a genre');
        continue;
      }
      filled_fields += 1;
      new_genres = genres;
    }
    
    if (filled_fields == 3) {
      const runtime = prompt("runtime (in minutes): ").trim();
      if (runtime === '') {
        console.log('The movie must have a runtime');
        continue;
      }
      filled_fields += 1;
      new_runtime = runtime;
    }

    if (filled_fields == 4) {
      const year = prompt("release year: ").trim();
      if (year === '') {
        console.log('The movie must have a release year');
        continue;
      }
      filled_fields += 1;
      new_year = year;
    }
    break;
  }
  const protobuf_movie_obj = build_protobuf_movie_object(new_title, new_cast, new_genres, Number(new_runtime), Number(new_year));
  
  const data = new Uint8Array(protobuf_movie_obj);

  return data;
}  


/**
 * Get information from API and, if API is waiting for a response, calls a function to get user input,
 * if it's an error or success message, display in console, if it's an close, destroy the client, and 
 * then calls main function
 */
// client.on('data', data => {
//   try {
//     console.log('data received from server: ');
//     console.log('data', data);
//     console.log('data.toString()', data.toString());

//     const stringData = data.toString().trim();
//     if (stringData === 'waitingCreate' || stringData.substring(0, 14).includes('waitingUpdate')) { // idk why but stringData is like ' waitingUpdate'
//       // console.log('entrou if')
//       const isUpdating = stringData.substring(0, 14) === 'waitingUpdate' ? global_movie_name : false;
      
//       const dataToWrite = getCreateOrUpdateData(isUpdating);

//       client.write(dataToWrite);
//       return;
//     }
//     else if (stringData === 'error') {
//       console.log('Error');
//     }
//     else if (stringData.includes('success')) {
//       console.log('Success');
//     }
//     else if (stringData.includes('close')) {
//       console.log('Connection closed');
//       client.destroy();
//     }

//     main();
//   } catch (err) {
//     console.log('catch error: ', err);
//   }
// });

/**
 * Get information for the CRUD (like the title of the movie)
 * @param {string} input: user input 
 * @returns string with all the information the CRUD needs 
 */
const get_extra_infos = input => {
  let extra_info = '';
  
  if (input === 'create') {
    return ' ';
  } else if (input === 'list') {
    const filter = prompt('filter (actor or genres): ').trim();
    
    if (filter === 'actor' || filter === 'genres') {
      extra_info += filter === 'actor' ? '4cast' : '6genres';
      const filter_input = prompt("Input: ").trim();
      extra_info += filter_input;
    } else {
      return undefined;
    }
  } else if (input === 'update') {
    const movie_name = prompt("Movie name: ").trim();
    global_movie_name = movie_name;
    extra_info += movie_name.length;
    extra_info += movie_name;
  } else if (input === 'delete') {
    const movie_name = prompt("Movie name: ").trim();
    global_movie_name = movie_name;
    extra_info += movie_name.length; 
    extra_info += movie_name;
  }

  return extra_info;
}

/**
 * Get the movie information, insert in a object, then converts to a protobuf
 * @param {string} title 
 * @param {string[]} cast 
 * @param {string[]} genres 
 * @param {number} runtime 
 * @param {number} year 
 * @returns {UInt8Array.buffer} protobuf of the movie inputted by params
 */
const build_protobuf_movie_object = (title, cast, genres, runtime, year) => {
  const movie_obj = {
    title, 
    cast: cast.split(','), 
    genres: genres.split(','),
    runtime, 
    year,
    type: 'movie'
  }

  const new_movie = new Movie();
  new_movie.setTitle(movie_obj.title);
  new_movie.setCastList(movie_obj.cast);
  new_movie.setGenresList(movie_obj.genres);
  new_movie.setRuntime(movie_obj.runtime);
  new_movie.setYear(movie_obj.year);
  new_movie.setType(movie_obj.type);

  const protobuf_movie_obj = new Uint8Array(new_movie.serializeBinary()).buffer; // array buffer de ASCII

  return protobuf_movie_obj;
}



const handle_create = () => {
  console.log('creating movie')
  const movie_obj = {
    title: undefined,
    cast: undefined,
    genres: undefined,
    runtime: undefined,
    year: undefined,
    type: 'movie',
  }

  while (filled_fields.length < 5) {
    if (filled_fields.length === 0) {
      const movie_title = prompt('Movie Title: ' );
      if (movie_title.trim() === '') {
        console.log('The movie must have a title');
        continue;
      }
      movie_obj.title = movie_title.trim();
      filled_fields += 1;
    }
    
    if (filled_fields.length === 1) {
      const movie_cast = prompt('Movie cast: ' ).trim();
      if (movie_cast === '') {
        console.log('The movie must have a cast');
        continue;
      }
      movie_obj.cast.push(movie_cast);
      filled_fields += 1;
    }

    if (filled_fields.length === 2) {
      const movie_genre = prompt('Movie genre: ' ).trim();
      if (movie_genre === '') {
        console.log('The movie must have a genre');
        continue;
      }
      movie_obj.genres.push(movie_genre);
      filled_fields += 1;
    }

    if (filled_fields.length === 3) {
      const movie_runtime = prompt('Movie runtime: ' ).trim();
      if (movie_runtime === '') {
        console.log('The movie must have a runtime');
        continue;
      }
      movie_obj.runtime = +movie_runtime;
      filled_fields += 1;
    }

    if (filled_fields.length === 4) {
      const movie_year = prompt('Movie year: ' ).trim();
      if (movie_year === '') {
        console.log('The movie must have a year');
        continue;
      }
      movie_obj.year = +movie_year;
      filled_fields += 1;
    }

    // const new_movie = new Movie



  }
}

const handle_listByCast = async (stub, cast) => {
  // console.log('handle_listByCast - stub: ', stub);
  console.log('handle_listByCast - cast: ', cast);
  await new Promise((resolve, reject) => {
    console.log('promise')
    //chama funcao read do stub, com Msg de parametro
    var call = stub.ListMoviesByCast({'message' : cast});
    // console.log('call', call);

    
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
        console.log('error: ', e)
        reject(e)
    });
})

}



/**
 * Convert user input in a shape the API will understand 
 * @param {string} input: user command for a CRUD or close connection
 * @returns {string} with command length + command
 */
const handle_command = async (stub, input) => {
  const command = input.split(' ')[0];

  switch (command) {
    case 'create':
      handle_create(stub);
      break;
  
    case 'listByCast':
      console.log('case list by cast')
      await handle_listByCast(stub, input.split(' ')[1]);
      break;

    case 'listByGenres':
      break;
      
    case 'update':
      break;

    case 'delete':
      break;

    case 'close':
      break;
              
    default:
      break;
  }

  return 'message';
}

/**
 * Get user command
 */
// const main = () => {
//   while (true) {
//     const line = prompt('$ ')
//     if (accepted_commands.includes(line.trim())) {
//       console.log('input: ', line.trim());
//       var message = build_header(line.trim());
      
//       if (!message) continue

//       const extra_infos = get_extra_infos(line);
//       if (extra_infos) message += extra_infos;
//       else continue;

//       const command = new Command();
//       command.message = message.trim();
//       client.write(command.message);
//       break;
//     } else if (line.trim() === 'close') {
//       client.destroy();
//       break;
//     }
//   }
// }

const create_stub = () => {
  const package_definition = protoLoader.loadSync('../proto/movie.proto');
  const proto_descriptor = grpc.loadPackageDefinition(package_definition).teste
  const stub = new proto_descriptor.MovieService('localhost:50051', grpc.credentials.createInsecure());

  return stub
}


const main = async () => {
  const stub = create_stub();

  console.log("You can use the following commands:");
  console.log('> create');
  console.log('> listByCast <name>');
  console.log('> listByGenres <genre>');
  console.log('> update <movie_name>');
  console.log('> delete <movie_name>');
  console.log('> close');
  
  // main while
  while (true) {
    const input = prompt('$ ').trim(); 
    console.log('a', input.split(' ')[0])
    if (accepted_commands.includes(input.split(' ')[0])) {
      console.log('b')
      const message = handle_command(stub, input);



    } else if (input === 'close') {
      stub.destroy();
      break;
    }
  }
}

main();