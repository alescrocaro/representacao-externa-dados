const net = require('net');
const protos = require('google-protobuf');
const protobuf = require("protobufjs");
const prompt = require('prompt-sync')();
const { Movie, Response, Command } = require('./movie_pb');

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


const SUCCESS = 200
const FAIL = 500

const client = new net.Socket();

var global_movie_name = undefined;

let PORT = 52515
PORT = 47323

client.connect(PORT, '127.0.0.1', function() {
    console.log('Connection established with server.');
    console.log("You can use the following commands:");
    console.log('> create');
    console.log('> list');
    console.log('> update');
    console.log('> delete');
    console.log('> close');
    main();
});

const getCreateOrUpdateData = (isUpdating) => {
  console.log('getCreateOrUpdateData')
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

client.on('data', data => {
  try {
    console.log('data received from server: ');
    console.log(data);
    console.log(data.toString());

    const stringData = data.toString().trim();
    if (stringData === 'waitingCreate' || stringData.substring(0, 14).includes('waitingUpdate')) { // idk why but stringData is like ' waitingUpdate'
      console.log('entrou if')
      const isUpdating = stringData.substring(0, 14) === 'waitingUpdate' ? global_movie_name : false;
      
      const dataToWrite = getCreateOrUpdateData(isUpdating);

      client.write(dataToWrite);
      return;
    }
    else if (stringData === 'error') {
      console.log('Error');
    }
    else if (stringData === 'success') {
      console.log('Success');
    }
    else if (stringData === 'close') {
      console.log('Connection closed');
      client.destroy();
    }

    main();
  } catch (err) {
    console.log('catch', err);
  } finally {
    console.log('finally')
  }
});

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


const build_header = (input) => {
  let message = '';

  switch (input) {
    case 'create':
      message += '6';
      message += 'create';
      break;
  
    case 'list':
      message += '4';
      message += 'list';
      break;

    case 'update':
      message += '6';
      message += 'update';
      break;

    case 'delete':
      message += '6';
      message += 'delete';
      break;

    case 'close':
      message += '5';
      message += 'close';
      break;
              
    default:
      message = undefined;
      break;
  }

  return message;
}

const main = () => {
  while (true) {
    const line = prompt('$ ')
    if (accepted_commands.includes(line.trim())) {
      console.log('input: ', line.trim());
      var message = build_header(line.trim());
      
      if (!message) continue

      const extra_infos = get_extra_infos(line);
      if (extra_infos) message += extra_infos;
      else continue;

      const command = new Command();
      command.message = message.trim();
      client.write(command.message);
      break;
    } else if (line.trim() === 'close') {
      client.destroy();
      break;
    }
  }
}