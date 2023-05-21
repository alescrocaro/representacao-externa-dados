// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var movie_pb = require('./movie_pb.js');

function serialize_teste_Command(arg) {
  if (!(arg instanceof movie_pb.Command)) {
    throw new Error('Expected argument of type teste.Command');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_teste_Command(buffer_arg) {
  return movie_pb.Command.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_teste_Movie(arg) {
  if (!(arg instanceof movie_pb.Movie)) {
    throw new Error('Expected argument of type teste.Movie');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_teste_Movie(buffer_arg) {
  return movie_pb.Movie.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_teste_Response(arg) {
  if (!(arg instanceof movie_pb.Response)) {
    throw new Error('Expected argument of type teste.Response');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_teste_Response(buffer_arg) {
  return movie_pb.Response.deserializeBinary(new Uint8Array(buffer_arg));
}


var MovieServiceService = exports.MovieServiceService = {
  createMovie: {
    path: '/teste.MovieService/CreateMovie',
    requestStream: false,
    responseStream: false,
    requestType: movie_pb.Movie,
    responseType: movie_pb.Response,
    requestSerialize: serialize_teste_Movie,
    requestDeserialize: deserialize_teste_Movie,
    responseSerialize: serialize_teste_Response,
    responseDeserialize: deserialize_teste_Response,
  },
  listMoviesByCast: {
    path: '/teste.MovieService/ListMoviesByCast',
    requestStream: false,
    responseStream: true,
    requestType: movie_pb.Command,
    responseType: movie_pb.Movie,
    requestSerialize: serialize_teste_Command,
    requestDeserialize: deserialize_teste_Command,
    responseSerialize: serialize_teste_Movie,
    responseDeserialize: deserialize_teste_Movie,
  },
  listMoviesByGenres: {
    path: '/teste.MovieService/ListMoviesByGenres',
    requestStream: false,
    responseStream: true,
    requestType: movie_pb.Command,
    responseType: movie_pb.Movie,
    requestSerialize: serialize_teste_Command,
    requestDeserialize: deserialize_teste_Command,
    responseSerialize: serialize_teste_Movie,
    responseDeserialize: deserialize_teste_Movie,
  },
  updateMovie: {
    path: '/teste.MovieService/UpdateMovie',
    requestStream: false,
    responseStream: false,
    requestType: movie_pb.Movie,
    responseType: movie_pb.Response,
    requestSerialize: serialize_teste_Movie,
    requestDeserialize: deserialize_teste_Movie,
    responseSerialize: serialize_teste_Response,
    responseDeserialize: deserialize_teste_Response,
  },
  deleteMovie: {
    path: '/teste.MovieService/DeleteMovie',
    requestStream: false,
    responseStream: false,
    requestType: movie_pb.Command,
    responseType: movie_pb.Response,
    requestSerialize: serialize_teste_Command,
    requestDeserialize: deserialize_teste_Command,
    responseSerialize: serialize_teste_Response,
    responseDeserialize: deserialize_teste_Response,
  },
};

exports.MovieServiceClient = grpc.makeGenericClientConstructor(MovieServiceService);
