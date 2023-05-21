"""
    Make connection with client and database using gRPC, make database calls (CRUD) and
    treat information from client. 
    Receives data through a protobuf.

    Author: Alexandre Aparecido Scrocaro Junior, Pedro Klayn
    
    Dates: 
        start: 15/05/2023
        more info: https://github.com/alescrocaro/representacao-externa-dados/atividade_rpc
"""

import json
import grpc

from flask import Flask
from flask_cors import CORS
# from movie_pb2_grpc import MovieServiceServicer, add_MovieServiceServicer_to_server
import movie_pb2_grpc
import movie_pb2
from db_connection import MongoDBClient
from pymongo.errors import PyMongoError
from concurrent import futures
from google.protobuf.json_format import MessageToJson
from grpc import RpcContext
from grpc_reflection.v1alpha import reflection


class Server:
    def __init__(self):
        """
            Start database connection
        """
        print('+++INIT SERVER')
        self.connected = False
        # Create instance of MongoDBClient class
        mongo_client = MongoDBClient()

        self.db_client = mongo_client.get_client()
        try:
            # try to access a collection or run an operation to check connection
            self.db = self.db_client['sample_mflix']
            self.collection = self.db['movies']

            print("MongoDB connection established!")
            # print('setou true')
            self.connected = True

        except PyMongoError as e:
            print("Connection failed:")
            print(e)

    def create_movie(self, data):
        """Converts json into an movie dict and inserts data in database 

        Args:
            data (json): movie data

        Returns:
            Response: 'success' or 'error' as Response protobuf
        """
        if self.connected:
            print('creating movie...')
            try:
                data = json.loads(data)
                print(data)
                
                result = self.collection.insert_one(data)
                print('Inserted document with _id:', result.inserted_id)
                
                num_documents = self.collection.count_documents({'_id': result.inserted_id}) 

                response = movie_pb2.Response()
                response.message = 'error'

                if num_documents == 0: 
                    return response
                
                response.message = 'success'
                return response

            except Exception as e:
                print(f'Error while inserting new movie: {e}')

    def read_movie(self, filter):
        """Get movies filtered by cast or genres

        Args:
            filter (string[]): ['cast'|'genres', '<user_input_from_client>']

        Returns:
            movies[]: All movies found into a dictionary list
        """
        if self.connected:
            print('reading movie...')
            print('filter', filter)
            filterType = filter[0]
            filterValue = filter[1]

            movies = self.collection.find({filterType: {'$regex': f'.*{filterValue}.*'}})

            num_documents = self.collection.count_documents({filterType: {'$regex': f'.*{filterValue}.*'}}) #number of movies found

            if num_documents == 0: 
                response = movie_pb2.Response()
                response.message = 'No movies found'
                return response
            

            return list(movies)

    def update_movie(self, new_movie):
        """Create movie object with new data received from client and update the correspondent movie in database

        Args:
            new_movie (Movie): new movie data to update movie
            movie_title (string): movie to be updated

        Returns:
            Response: 'error' or 'success' in a protobuf response
        """
        if self.connected:
            print('updating movie...')
            try:
                # data = json.loads(new_movie)
                # print('data', data)
                # print('data.id', data['id'])
                # movies = list(self.collection.find({'_id': data['id']}))
                # print('movies[0]', movies[0])
                # # movie_id = movies[0]
                # result = self.collection.update_one({'_id': movies[0]['_id']}, {"$set": data})
                # print(result.modified_count)
                
                response = movie_pb2.Response()
                response.message = 'success'
                # if result.modified_count > 0:
                #     return response
                
                response.message = 'error'
                return response


            except Exception as e:
                print(f'Error while updating movie: {e}')

    def delete_movie(self, movie_title):
        """Deletes a movie from database by its title

        Args:
            movie_title (string): received from client

        Returns:
            Response: 'error' or 'success' in a protobuf response
        """
        if self.connected:
            print('deleting movie...')
            try: 
                result = self.collection.delete_one({'title': movie_title})
                response = movie_pb2.Response()
                response.message = 'success'
                if result.deleted_count > 0:
                    return response
                
                response.message = 'error'
                return response

            except Exception as e:
                print(f'Error while deleting movie: {e}')


def movie_obj_to_protobuf(movie):
    """Create a Movie protobuf from a movie object

    Args:
        movie (Movie): 

    Returns:
        protobuf movie: 
    """    
    try:
        print('movie_dict_to_protobuf')

        print('movie', movie)

        movie_protobuf = movie_pb2.Movie()
        movie_protobuf.title = movie['title']
        print('movie instance', movie_protobuf)
        # print('movie instance', movie_protobuf)
        # movie_protobuf.cast.extend(movie['cast'])
        # print('movie instance', movie_protobuf)
        # movie_protobuf.genres.extend(movie['genres'])
        # print('movie instance', movie_protobuf)
        # movie_protobuf.runtime = movie['runtime']
        # print('movie instance', movie_protobuf)
        # movie_protobuf.year = movie['year']
        # print('movie instance', movie_protobuf)
        # movie_protobuf.type = movie['type']
        # print('movie instance', movie_protobuf)

        print('movie_protobuf', movie_protobuf)


        return movie_protobuf

    except Exception as e:
        print(f"Error while converting movie into protobuf: {e}")



class MovieController(movie_pb2_grpc.MovieServiceServicer):
    """class to handle client request

    Args:
        movie_pb2_grpc (MovieServiceServicer): servicer
    """
    def __init__(self): # starts db server
        print('__init__')
        self.db_server = Server()

    # def _add_cors_headers(self, context: RpcContext):
    #     context.send_initial_metadata((
    #         ('Access-Control-Allow-Origin', '*'),  # Configurar o valor desejado para o cabeçalho
    #         ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE'),  # Métodos permitidos
    #         ('Access-Control-Allow-Headers', 'Content-Type'),
    #     ))

    def CreateMovie(self, request, context):
        """get client request and calls create_movie of database class

        Args:
            request (Movie): movie sent by client
            context (_type_): _description_

        Returns:
            Response: 'success' or 'error'
        """
        print('create movie')
        json_movie = MessageToJson(request)
        print('teste')
        database_server_response = self.db_server.create_movie(json_movie)

        return database_server_response

    def ListMoviesByGenres(self, request, context):
        """get client request and calls read_movie of database class

        Args:
            request (Command): movie title sent by client
            context (_type_): _description_

        Returns:
            Movie[]: every movie found
        """
        print('read movie by genres')
        movies = self.db_server.read_movie(['genres', request.message])
        print(movies)
        for movie in movies:
            yield movie_obj_to_protobuf(movie)

    def ListMoviesByCast(self, request, context):
        """get client request and calls read_movie of database class

        Args:
            request (Command): movie title sent by client
            context (_type_): _description_

        Returns:
            Movie[]: every movie found
        """
        print('read movie by cast')
        movies = self.db_server.read_movie(['cast', request.message])
        print(movies)
        for movie in movies:
            yield movie_obj_to_protobuf(movie)

    def UpdateMovie(self, request, context):
        print('update movie')
        json_movie = MessageToJson(request)
        database_server_response = self.db_server.update_movie(json_movie)

        return database_server_response

    def DeleteMovie(self, request, context):
        """get client request and calls delete_movie of database class

        Args:
            request (Command): movie title sent by client
            context (_type_): _description_

        Returns:
            Response: 'success' or 'error'
        """
        print('update movie')
        database_server_response = self.db_server.delete_movie(request.message)

        return database_server_response



def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    reflection.enable_server_reflection("MovieService", server)
    movie_pb2_grpc.add_MovieServiceServicer_to_server(MovieController(), server)
    server.add_insecure_port('127.0.0.1:50051')
    server.start()
    print("Server up and listening to port 50051")
    server.wait_for_termination()




if __name__ == '__main__':
    print('main')
    serve()