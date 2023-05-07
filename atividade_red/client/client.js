const net = require('net');
const readline = require('readline');
const protos = require('google-protobuf');
const protobuf = require("protobufjs");
const prompt = require('prompt-sync')();

const acceptedCommands = ['create', 'list', 'update', 'delete', 'close']

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new net.Socket();

// client.connect(4444, '127.0.0.1', function() {
client.connect(7770, '127.0.0.1', function() {
    console.log('Connection established with server.');
    console.log("You can use the following commands:");
    console.log('create');
    console.log('list');
    console.log('update');
    console.log('delete');
    rl.prompt();
});

client.on('data', function(data) {
    console.log('Dados recebidos do servidor: ' + data);
    if (data.toString() === 'close') {
      client.destroy();
      // rl.close();
    }
    else {
      rl.prompt();
    }
});

rl.on('line', function(line) {
  console.log('mensagem', line)
  if (acceptedCommands.includes(line.split()[0])) {
    console.log('line.trim()', line.trim());
    client.write(line.trim());
  }
});
