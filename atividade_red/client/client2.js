const net = require('net');
const protos = require('google-protobuf');
const protobuf = require("protobufjs");
const prompt = require('prompt-sync')();

const accepted_commands = ['create', 'list', 'update', 'delete']

const REQ = 1;
const RES = 2;

const CREATE_ID = 1;
const LIST_ID = 2;
const UPDATE_ID = 3;
const DELETE_ID = 4;
const CLOSE_ID = 5;

GENRE_FILTER_ID = 1
CAST_FILTER_ID = 2

const client = new net.Socket();

// client.connect(4444, '127.0.0.1', function() {
client.connect(7770, '127.0.0.1', function() {
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
      var message = build_message(line.trim());
      
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
    const title = prompt('title: ').trim();
    extra_info += title;
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

const build_message = (input) => {
  console.log('build_message');
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



// number_to_bytes function: converts a number to in a bytes buffer
// explanation:
//     toString() converts the number into a hex decimal string
//     padStart() adds a zero in the left if string has only one char
//     Buffer.from creates a buffer from a hex dec string
// params: 
//     num: number to be converted to bytes
const number_to_bytes = (num) => {
  return Buffer.from(num.toString(16).padStart(2, '0'), 'hex');
}