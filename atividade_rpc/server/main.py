"""
    Make connection with client and database using gRPC, make database calls (CRUD) and
    treat information from client. 
    Receives data through a protobuf.

    Author: Alexandre Aparecido Scrocaro Junior, Pedro Klayn
    
    Dates: 
        start: 15/05/2023
        more info: https://github.com/alescrocaro/representacao-externa-dados
"""

import json
import grpc

from movie_pb2_grpc import MovieServiceServicer, add_MovieServiceServicer_to_server
from movie_pb2 import Movie, MoviesList, Response
from db_connection import MongoDBClient
from pymongo.errors import PyMongoError
from concurrent import futures
from google.protobuf.json_format import MessageToJson

class Server:
    def __init__(self):
        """
            Start database connection
        """
        # print('setou false')
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

                response = Response()
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
            MoviesList: All movies found into a dictionary list
        """
        if self.connected:
            print('reading movie...')
            print('filter', filter)
            filterType = filter[0]
            filterValue = filter[1]

            movies = self.collection.find({filterType: {'$regex': f'.*{filterValue}.*'}})

            num_documents = self.collection.count_documents({filterType: {'$regex': f'.*{filterValue}.*'}}) #number of movies found

            if num_documents == 0: 
                response = Response()
                response.message = 'No movies found'
                return response
            

            return movies_dict_to_protobuf(movies)

    def update_movie(self, new_movie, movie_title):
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
                data = json.loads(new_movie)
                print(data)
                
                result = self.collection.update_one({'title': movie_title}, {"$set": data})
                print(f'updated movie: {movie_title}')
                
                response = Response()
                response.message = 'success'
                if result.modified_count > 0:
                    return response
                
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
                response = Response()
                response.message = 'success'
                if result.deleted_count > 0:
                    return response
                
                response.message = 'error'
                return response

            except Exception as e:
                print(f'Error while deleting movie: {e}')


def movies_dict_to_protobuf(movies_dict):
    """Create a object list from dictionaries received, then create a MovieList. Then returns the resultant protobuf 

    Args:
        movies_dict (MoviesList): 
        isUpdating (bool, optional): controls response returned if user is updating a movie. Defaults to False.

    Returns:
        string | MoviesList: if no movie was found, returns the string 'No list with all movies in a serialized string or a message that found no movie
    """    
    try:
        movies = []

        for movie_dict in movies_dict:
            movie = Movie()
            movie.title = movie_dict['title']
            movies.append(movie)

        movie_list = MoviesList()
        movie_list.movies.extend(movies)

        return movie_list

    except Exception as e:
        print(f"Error while converting movies_dict into protobuf: {e}")


def str_to_num(str):
    """Converts string into a number if it is digit

    Args:
        str (string): string to be converted in number

    Returns:
        int | None: int if conversion went well, None if string is not a digit
    """
    if str.isdigit():
        return int(str)

    return None


# def handle_client_connection(client_socket, client_address, db_server):
#     """handle client command inputs for CRUD or close connection

#     Args:
#         client_socket (socket): client socket to send and receive data
#         client_address (_RetAddress): client address to display in messages in terminal
#         db_server (Server): class created to do db operations
#     """
#     print('handle_client_connection')
#     while True:
#         try:
#             print('waiting req')
#             data = client_socket.recv(1024)

#             if not data:
#                 break

#             req_size = str_to_num(data[0:1].decode('utf-8'))
#             print('req_size', req_size)
#             last_pos_req = 1 + req_size
#             req_type = data[1:last_pos_req].decode('utf-8')
#             print('req_type', req_type)

#             if req_type == 'create':
#                 response = Response()
#                 response.message = 'waitingCreate'
#                 client_socket.send(response.SerializeToString())

#                 print('waiting create data')
#                 data = client_socket.recv(1024)
#                 print('data', data)

#                 response = db_server.create_movie(data)
#                 print('response', response)
#                 client_socket.send(response)

#             if req_type == 'list':
#                 filter_size = str_to_num(data[last_pos_req:last_pos_req+1].decode('utf-8'))
#                 last_pos_filter = last_pos_req+1+filter_size
#                 filter_type = data[last_pos_req+1:last_pos_filter].decode('utf-8')
#                 input = data[last_pos_filter:].decode('utf-8')
#                 print('filter_type', filter_type)
#                 print('input', input)

#                 if filter_type == 'genres':
#                     movies = db_server.read_movie([filter_type, input])

#                     response = movies_dict_to_string(movies)

#                     print('envia', response)
#                     client_socket.send(response)

#                 elif filter_type == 'cast':
#                     movies = db_server.read_movie([filter_type, input])

#                     response = movies_dict_to_string(movies)

#                     print('envia', response)
#                     client_socket.send(response)

#             elif req_type == 'update':
#                 movie_title_size = str_to_num(data[last_pos_req:last_pos_req+1].decode('utf-8'))
#                 last_pos_movie_title = last_pos_req+1+movie_title_size
#                 movie_title = data[last_pos_req+1:last_pos_movie_title].decode('utf-8')

#                 movies = db_server.read_movie(['title', movie_title])
#                 print('movies', movies)

#                 movie = movies_dict_to_string(movies, isUpdating=True)
                
#                 print('movie', movie)
#                 client_socket.send(movie)
                


#                 if movies == None:
#                     continue
#                 print('waiting update data')
#                 data = client_socket.recv(1024)
#                 print('data', data)

#                 response = db_server.update_movie(data, movie_title)
#                 print('response', response)
#                 client_socket.send(response)

#             elif req_type == 'delete':
#                 movie_title_size = str_to_num(data[last_pos_req:last_pos_req+1].decode('utf-8'))
#                 last_pos_movie_title = last_pos_req+1+movie_title_size
#                 movie_title = data[last_pos_req+1:last_pos_movie_title].decode('utf-8')

#                 response = db_server.delete_movie(movie_title)
#                 client_socket.send(response)

#             elif req_type == 'close':
#                 print(f'Connection with {client_address} closed.')
#                 # print('setou false')
#                 db_server.connected = False; 
#                 client_socket.send('close'.encode('utf-8'))
#                 break

#         except Exception as e:
#             print(f"Error while handling connection: {e}")
#             # print('setou false')
#             db_server.connected = False; 
#             break
    
#     # print('setou false')
#     db_server.connected = False; 
#     print(f'Connection with {client_address} closed.')
#     client_socket.close()
#     return
            

class MovieController(MovieServiceServicer):
    def __init__(self):
        self.db_server = Server()
        

    def CreateMovie(self, movie):
        print('create movie')
        json_movie = MessageToJson(movie)
        database_server_response = self.db_server.create_movie(json_movie)

        return database_server_response

    def ReadMoviesByGenres(self, filter):
        print('read movies by genres')
        movies = self.db_server.read_movie(['genres', filter])
        for movie in movies:
            yield movie

    def ReadMoviesByCast(self, filter):
        print('read movie by genres')
        movies = self.db_server.read_movie(['cast', filter])
        for movie in movies:
            yield movie

    def UpdateMovie(self, movie):
        print('update movie')
        json_movie = MessageToJson(movie)
        database_server_response = self.db_server.update_movie(json_movie)

        return database_server_response

    def DeleteMovie(self, movie_title):
        print('update movie')
        database_server_response = self.db_server.delete_movie(movie_title)

        return database_server_response

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    add_MovieServiceServicer_to_server(MovieController(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server up and listening to port 50051")
    server.wait_for_termination()



if __name__ == '__main__':
    serve()