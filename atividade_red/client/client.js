const net = require('net');
const protos = require('google-protobuf');
const protobuf = require("protobufjs");
const prompt = require('prompt-sync')();
const { Movie } = require('./movie_pb');

const accepted_commands = ['create', 'list', 'update', 'delete']

const REQ = 1;
const RES = 2;

const CREATE_ID = 1;
const LIST_ID = 2;
const UPDATE_ID = 3;
const DELETE_ID = 4;
const CLOSE_ID = 5;

const GENRE_FILTER_ID = 1
const CAST_FILTER_ID = 2

const client = new net.Socket();

let PORT = 52515
PORT = 47324

client.connect(PORT, '127.0.0.1', function() {
    console.log('Connection established with server.');
    console.log("You can use the following commands:");
    console.log('create');
    console.log('list');
    console.log('update');
    console.log('delete');
    console.log('close');
    initial_input();
});

client.on('data', data => {
  try {
    console.log('Dados recebidos do servidor: ');
    console.log(data.toString());
    if (data.toString() === 'waitingCreate') {
      let aux_title = '';
      let aux_cast = '';
      let aux_genres = '';
      let aux_runtime = '';
      let aux_year = '';
      let filled_fields = 0;
      while (true) {
        if (filled_fields == 0) {
          const title = prompt('title: ').trim();
          if (title === '') {
            console.log('The movie must have a title');
            continue;
          }
          // extra_info += number_to_bytes(title.length);
          // extra_info += title;
          filled_fields += 1;
          aux_title = title;
        }
  
        if (filled_fields == 1) {
          const cast = prompt("cast (if more than one split with ','): ").trim();
          if (cast === '') {
            console.log('The movie must have a cast');
            continue;
          }
          // extra_info += number_to_bytes(cast.length);
          // extra_info += cast;
          filled_fields += 1;
          aux_cast = cast;
        }
  
        if (filled_fields == 2) {
          const genres = prompt("genres (if more than one split with ','): ").trim();
          if (genres === '') {
            console.log('The movie must have a genre');
            continue;
          }
          // extra_info += number_to_bytes(genres.length);
          // extra_info += genres;
          filled_fields += 1;
          aux_genres = genres;
        }
        
        if (filled_fields == 3) {
          const runtime = prompt("runtime (in minutes): ").trim();
          if (runtime === '') {
            console.log('The movie must have a runtime');
            continue;
          }
          // extra_info += number_to_bytes(runtime.length);
          // extra_info += runtime;
          filled_fields += 1;
          aux_runtime = runtime;
        }
  
        if (filled_fields == 4) {
          const year = prompt("release year: ").trim();
          if (year === '') {
            console.log('The movie must have a release year');
            continue;
          }
          // extra_info += number_to_bytes(year.length);
          // extra_info += year;
          filled_fields += 1;
          aux_year = year;
        }
        break;
      }
      const protobuf_movie_obj = build_protobuf_movie_object(aux_title, aux_cast, aux_genres, Number(aux_runtime), Number(aux_year))
      
      const data = new Uint8Array(protobuf_movie_obj)
      client.write(data);


    }
    initial_input();
  } catch (err) {
    console.log('catch', err);
  } finally {
    console.log('finally')
  }
});

const initial_input = () => {
  while (true) {
    const line = prompt('$ ')
    if (accepted_commands.includes(line.trim())) {
      console.log('input: ', line.trim());
      var message = build_header(line.trim());
      
      if (!message) continue

      const extra_infos = get_extra_infos(line);
      if (extra_infos) message += extra_infos;
      else continue;


      client.write(message);
      break;
    } else if (line.trim() === 'close') {
      client.destroy();
      break;
    }
  }
}

const get_extra_infos = input => {
  let extra_info = '';
  let aux_title = '';
  let aux_cast = '';
  let aux_genres = '';
  let aux_runtime = '';
  let aux_year = '';
  if (input === 'create') {
    let filled_fields = 0;
    // while (true) {
    //   if (filled_fields == 0) {
    //     const title = prompt('title: ').trim();
    //     if (title === '') {
    //       console.log('The movie must have a title');
    //       continue;
    //     }
    //     extra_info += number_to_bytes(title.length);
    //     extra_info += title;
    //     filled_fields += 1;
    //     aux_title = title
    //   }

    //   if (filled_fields == 1) {
    //     const cast = prompt("cast (if more than one split with ','): ").trim();
    //     if (cast === '') {
    //       console.log('The movie must have a cast');
    //       continue;
    //     }
    //     extra_info += number_to_bytes(cast.length);
    //     extra_info += cast;
    //     filled_fields += 1;
    //     aux_cast = cast
    //   }

    //   if (filled_fields == 2) {
    //     const genres = prompt("genres (if more than one split with ','): ").trim();
    //     if (genres === '') {
    //       console.log('The movie must have a genre');
    //       continue;
    //     }
    //     extra_info += number_to_bytes(genres.length);
    //     extra_info += genres;
    //     filled_fields += 1;
    //     aux_genres = genres
    //   }
      
    //   if (filled_fields == 3) {
    //     const runtime = prompt("runtime (in minutes): ").trim();
    //     if (runtime === '') {
    //       console.log('The movie must have a runtime');
    //       continue;
    //     }
    //     extra_info += number_to_bytes(runtime.length);
    //     extra_info += runtime;
    //     filled_fields += 1;
    //     aux_runtime = runtime
    //   }

    //   if (filled_fields == 4) {
    //     const year = prompt("release year: ").trim();
    //     if (year === '') {
    //       console.log('The movie must have a release year');
    //       continue;
    //     }
    //     extra_info += number_to_bytes(year.length);
    //     extra_info += year;
    //     filled_fields += 1;
    //     aux_year = year
    //   }

    //   const protobuf_movie_obj = build_protobuf_movie_object(aux_title, aux_cast, aux_genres, Number(aux_runtime), Number(aux_year))
    //  
    // return protobuf_movie_obj;
    return 'teste';
    // }

  } else if (input === 'list') {
    const filter = prompt('filter (actor or genre): ').trim();
    
    if (filter === 'actor' || filter === 'genre') {
      extra_info += number_to_bytes(filter === 'actor' ? CAST_FILTER_ID : GENRE_FILTER_ID) ; 
      const filter_input = prompt("Input: ").trim();
      extra_info += number_to_bytes(filter_input.length); // size of filters
      extra_info += filter_input;
    } else {
      return undefined;
    }
  }

  return extra_info;
}

const build_header = (input) => {
  console.log('build_header');
  let message = number_to_bytes(REQ);

  switch (input) {
    case 'create':
      message += number_to_bytes(CREATE_ID);
      break;
  
    case 'list':
      message += number_to_bytes(LIST_ID);
      break;

    case 'update':
      message += number_to_bytes(UPDATE_ID);
      break;

    case 'delete':
      message += number_to_bytes(DELETE_ID);
      break;
              
    default:
      message = undefined;
      break;
  }

  return message;
}


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


  // const protobuf_movie_obj = new_movie.serializeBinary();

  // const json_movie = new_movie.toJSON();
  // const str_movie = JSON.stringify(json_movie);
  const protobuf_movie_obj = new Uint8Array(new_movie.serializeBinary()).buffer;
  console.log(protobuf_movie_obj);
  // const protobuf_movie_obj = new_movie.seria

  return protobuf_movie_obj;
}


/** 
  * number_to_bytes function: converts a number to in a bytes buffer
  * params: 
  *     num: number to be converted to bytes
  * explanation:
  *     toString() converts the number into a hex decimal string
  *     padStart() adds a zero in the left if string has only one char
  *     Buffer.from creates a buffer from a hex dec string
*/
const number_to_bytes = (num) => {
  return Buffer.from(num.toString(16).padStart(2, '0'), 'hex');
}