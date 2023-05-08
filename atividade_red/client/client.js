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

const getCreateOrUpdateData = (writeType) => {
  console.log('getCreateOrUpdateData');
  let new_title = '';
  let new_cast = '';
  let new_genres = '';
  let new_runtime = '';
  let new_year = '';
  let filled_fields = 0;
  while (true) {
    if (filled_fields == 0) {
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
    console.log('break getCreateOrUpdateData');
    break;
  }
  const protobuf_movie_obj = build_protobuf_movie_object(new_title, new_cast, new_genres, Number(new_runtime), Number(new_year));
  
  const data = new Uint8Array(protobuf_movie_obj);

  return data;
}  

client.on('data', data => {
  try {
    console.log('data received from server: ');
    console.log(data.toString());
    if (data.toString() === 'waitingCreate') {
      const dataToWrite = getCreateOrUpdateData(data.toString());

      client.write(dataToWrite);
      return;
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
  
  if (input === 'create') {
    return 'antiBug';
  } else if (input === 'list') {
    const filter = prompt('filter (actor or genre): ').trim();
    
    if (filter === 'actor' || filter === 'genre') {
      extra_info += number_to_bytes(filter === 'actor' ? CAST_FILTER_ID : GENRE_FILTER_ID) ; 
      const filter_input = prompt("Input: ").trim();
      extra_info += number_to_bytes(filter_input.length); 
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

  const protobuf_movie_obj = new Uint8Array(new_movie.serializeBinary()).buffer; // array buffer de ASCII

  return protobuf_movie_obj;
}


/** 
  * number_to_bytes function: converts a number to in a bytes buffer
  * 
  * params: 
  *     num: number to be converted to bytes
  * 
  * explanation:
  *     toString() converts the number into a hex decimal string,
  *     padStart() adds a zero in the left if string has only one char,
  *     Buffer.from creates a buffer from a hex dec string.
*/
const number_to_bytes = (num) => {
  return Buffer.from(num.toString(16).padStart(2, '0'), 'hex');
}