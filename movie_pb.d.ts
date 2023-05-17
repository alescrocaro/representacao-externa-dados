import * as jspb from 'google-protobuf'



export class Movie extends jspb.Message {
  getId(): number;
  setId(value: number): Movie;
  hasId(): boolean;
  clearId(): Movie;

  getTitle(): string;
  setTitle(value: string): Movie;

  getCastList(): Array<string>;
  setCastList(value: Array<string>): Movie;
  clearCastList(): Movie;
  addCast(value: string, index?: number): Movie;

  getGenresList(): Array<string>;
  setGenresList(value: Array<string>): Movie;
  clearGenresList(): Movie;
  addGenres(value: string, index?: number): Movie;

  getRuntime(): number;
  setRuntime(value: number): Movie;

  getYear(): number;
  setYear(value: number): Movie;

  getType(): string;
  setType(value: string): Movie;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Movie.AsObject;
  static toObject(includeInstance: boolean, msg: Movie): Movie.AsObject;
  static serializeBinaryToWriter(message: Movie, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Movie;
  static deserializeBinaryFromReader(message: Movie, reader: jspb.BinaryReader): Movie;
}

export namespace Movie {
  export type AsObject = {
    id?: number,
    title: string,
    castList: Array<string>,
    genresList: Array<string>,
    runtime: number,
    year: number,
    type: string,
  }

  export enum XIdCase { 
    X_ID_NOT_SET = 0,
    _ID = 1,
  }
}

export class MoviesList extends jspb.Message {
  getMoviesList(): Array<Movie>;
  setMoviesList(value: Array<Movie>): MoviesList;
  clearMoviesList(): MoviesList;
  addMovies(value?: Movie, index?: number): Movie;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MoviesList.AsObject;
  static toObject(includeInstance: boolean, msg: MoviesList): MoviesList.AsObject;
  static serializeBinaryToWriter(message: MoviesList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MoviesList;
  static deserializeBinaryFromReader(message: MoviesList, reader: jspb.BinaryReader): MoviesList;
}

export namespace MoviesList {
  export type AsObject = {
    moviesList: Array<Movie.AsObject>,
  }
}

export class Command extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): Command;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Command.AsObject;
  static toObject(includeInstance: boolean, msg: Command): Command.AsObject;
  static serializeBinaryToWriter(message: Command, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Command;
  static deserializeBinaryFromReader(message: Command, reader: jspb.BinaryReader): Command;
}

export namespace Command {
  export type AsObject = {
    message: string,
  }
}

export class Response extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): Response;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Response.AsObject;
  static toObject(includeInstance: boolean, msg: Response): Response.AsObject;
  static serializeBinaryToWriter(message: Response, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Response;
  static deserializeBinaryFromReader(message: Response, reader: jspb.BinaryReader): Response;
}

export namespace Response {
  export type AsObject = {
    message: string,
  }
}

