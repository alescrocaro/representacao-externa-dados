/**
 * @fileoverview gRPC-Web generated client stub for teste
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.4.2
// 	protoc              v4.23.0-rc3
// source: movie.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as movie_pb from './movie_pb';


export class MovieServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorCreateMovie = new grpcWeb.MethodDescriptor(
    '/teste.MovieService/CreateMovie',
    grpcWeb.MethodType.UNARY,
    movie_pb.Movie,
    movie_pb.Response,
    (request: movie_pb.Movie) => {
      return request.serializeBinary();
    },
    movie_pb.Response.deserializeBinary
  );

  createMovie(
    request: movie_pb.Movie,
    metadata: grpcWeb.Metadata | null): Promise<movie_pb.Response>;

  createMovie(
    request: movie_pb.Movie,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: movie_pb.Response) => void): grpcWeb.ClientReadableStream<movie_pb.Response>;

  createMovie(
    request: movie_pb.Movie,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: movie_pb.Response) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/teste.MovieService/CreateMovie',
        request,
        metadata || {},
        this.methodDescriptorCreateMovie,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/teste.MovieService/CreateMovie',
    request,
    metadata || {},
    this.methodDescriptorCreateMovie);
  }

  methodDescriptorListMoviesByCast = new grpcWeb.MethodDescriptor(
    '/teste.MovieService/ListMoviesByCast',
    grpcWeb.MethodType.SERVER_STREAMING,
    movie_pb.Command,
    movie_pb.Movie,
    (request: movie_pb.Command) => {
      return request.serializeBinary();
    },
    movie_pb.Movie.deserializeBinary
  );

  listMoviesByCast(
    request: movie_pb.Command,
    metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<movie_pb.Movie> {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/teste.MovieService/ListMoviesByCast',
      request,
      metadata || {},
      this.methodDescriptorListMoviesByCast);
  }

  methodDescriptorListMoviesByGenres = new grpcWeb.MethodDescriptor(
    '/teste.MovieService/ListMoviesByGenres',
    grpcWeb.MethodType.SERVER_STREAMING,
    movie_pb.Command,
    movie_pb.Movie,
    (request: movie_pb.Command) => {
      return request.serializeBinary();
    },
    movie_pb.Movie.deserializeBinary
  );

  listMoviesByGenres(
    request: movie_pb.Command,
    metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<movie_pb.Movie> {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/teste.MovieService/ListMoviesByGenres',
      request,
      metadata || {},
      this.methodDescriptorListMoviesByGenres);
  }

  methodDescriptorUpdateMovie = new grpcWeb.MethodDescriptor(
    '/teste.MovieService/UpdateMovie',
    grpcWeb.MethodType.UNARY,
    movie_pb.Movie,
    movie_pb.Response,
    (request: movie_pb.Movie) => {
      return request.serializeBinary();
    },
    movie_pb.Response.deserializeBinary
  );

  updateMovie(
    request: movie_pb.Movie,
    metadata: grpcWeb.Metadata | null): Promise<movie_pb.Response>;

  updateMovie(
    request: movie_pb.Movie,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: movie_pb.Response) => void): grpcWeb.ClientReadableStream<movie_pb.Response>;

  updateMovie(
    request: movie_pb.Movie,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: movie_pb.Response) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/teste.MovieService/UpdateMovie',
        request,
        metadata || {},
        this.methodDescriptorUpdateMovie,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/teste.MovieService/UpdateMovie',
    request,
    metadata || {},
    this.methodDescriptorUpdateMovie);
  }

  methodDescriptorDeleteMovie = new grpcWeb.MethodDescriptor(
    '/teste.MovieService/DeleteMovie',
    grpcWeb.MethodType.UNARY,
    movie_pb.Command,
    movie_pb.Response,
    (request: movie_pb.Command) => {
      return request.serializeBinary();
    },
    movie_pb.Response.deserializeBinary
  );

  deleteMovie(
    request: movie_pb.Command,
    metadata: grpcWeb.Metadata | null): Promise<movie_pb.Response>;

  deleteMovie(
    request: movie_pb.Command,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: movie_pb.Response) => void): grpcWeb.ClientReadableStream<movie_pb.Response>;

  deleteMovie(
    request: movie_pb.Command,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: movie_pb.Response) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/teste.MovieService/DeleteMovie',
        request,
        metadata || {},
        this.methodDescriptorDeleteMovie,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/teste.MovieService/DeleteMovie',
    request,
    metadata || {},
    this.methodDescriptorDeleteMovie);
  }

}

