# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: movie.proto
"""Generated protocol buffer code."""
from google.protobuf.internal import builder as _builder
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x0bmovie.proto\x12\x05teste\"{\n\x05Movie\x12\x10\n\x03_id\x18\x01 \x01(\x05H\x00\x88\x01\x01\x12\r\n\x05title\x18\x02 \x01(\t\x12\x0c\n\x04\x63\x61st\x18\x03 \x03(\t\x12\x0e\n\x06genres\x18\x04 \x03(\t\x12\x0f\n\x07runtime\x18\x05 \x01(\x05\x12\x0c\n\x04year\x18\x06 \x01(\x05\x12\x0c\n\x04type\x18\x07 \x01(\tB\x06\n\x04X_id\"*\n\nMoviesList\x12\x1c\n\x06movies\x18\x01 \x03(\x0b\x32\x0c.teste.Movie\"\x1a\n\x07\x43ommand\x12\x0f\n\x07message\x18\x01 \x01(\t\"\x1b\n\x08Response\x12\x0f\n\x07message\x18\x01 \x01(\t2\x92\x02\n\x0cMovieService\x12\x30\n\x0b\x43reateMovie\x12\x0e.teste.Command\x1a\x0f.teste.Response\"\x00\x12\x34\n\x10ListMoviesByCast\x12\x0e.teste.Command\x1a\x0c.teste.Movie\"\x00\x30\x01\x12\x36\n\x12ListMoviesByGenres\x12\x0e.teste.Command\x1a\x0c.teste.Movie\"\x00\x30\x01\x12\x30\n\x0bUpdateMovie\x12\x0e.teste.Command\x1a\x0f.teste.Response\"\x00\x12\x30\n\x0b\x44\x65leteMovie\x12\x0e.teste.Command\x1a\x0f.teste.Response\"\x00\x62\x06proto3')

_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, globals())
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'movie_pb2', globals())
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _MOVIE._serialized_start=22
  _MOVIE._serialized_end=145
  _MOVIESLIST._serialized_start=147
  _MOVIESLIST._serialized_end=189
  _COMMAND._serialized_start=191
  _COMMAND._serialized_end=217
  _RESPONSE._serialized_start=219
  _RESPONSE._serialized_end=246
  _MOVIESERVICE._serialized_start=249
  _MOVIESERVICE._serialized_end=523
# @@protoc_insertion_point(module_scope)