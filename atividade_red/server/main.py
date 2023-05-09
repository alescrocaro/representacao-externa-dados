import socket

from db_connection import MongoDBClient
from pymongo.errors import PyMongoError
from movie_pb2 import Movie, MoviesList
from google.protobuf.json_format import MessageToDict

class Server:
    def __init__(self):
        self.connected = False
        # Create instance of MongoDBClient class
        mongo_client = MongoDBClient()

        self.db_client = mongo_client.get_client()
        try:
            # try to access a collection or run an operation to check connection
            self.db = self.db_client['sample_mflix']
            self.collection = self.db['movies']

            print("MongoDB connection established!")
            self.connected = True

        except PyMongoError as e:
            print("Connection failed:")
            print(e)

    def create_movie(self, data):
        if self.connected:
            print('creating movie...')
            try:
                movie = Movie()
                try:
                    movie.ParseFromString(data)
                    # print(movie.title)
                    # print(movie.cast)
                    # print(movie.genres)
                    # print(movie.runtime)
                    # print(movie.year)
                    # print(movie.type)

                except Exception as e:
                    print(f'Error while deserializing: {e}')
                
                movie_dict = {
                    "title": f"{movie.title}",
                    "cast": f"{movie.cast}",
                    "genres": f"{movie.genres}",
                    "runtime": f"{movie.runtime}",
                    "year": f"{movie.year}",
                    "type": f"{movie.type}",
                }
                
                result = self.collection.insert_one(movie_dict)
                print('Inserted document with _id:', result.inserted_id)
                
                movies = self.collection.find({'_id': result.inserted_id})

                num_documents = self.collection.count_documents({'_id': result.inserted_id}) 

                if num_documents == 0: 
                    return FAIL.to_bytes(1, 'big')
                
                return SUCCESS.to_bytes(1, 'big')

            except Exception as e:
                print(f'Error while inserting new movie: {e}')

    def read_movie(self, filter):
        if self.connected:
            print('reading movie...')
            print('filter', filter)
            filterType = filter[0]
            filterValue = filter[1]

            print(filterType, filterValue)

            movies = self.collection.find({filterType: {'$regex': f'.*{filterValue}.*'}})

            num_documents = self.collection.count_documents({filterType: {'$regex': f'.*{filterValue}.*'}}) #number of movies found

            if num_documents == 0: 
                return None

            return movies

    def update_movie(self, new_movie, movie_title):
        if self.connected:
            print('updating movie...')
            try:
                movie = Movie()
                try:
                    movie.ParseFromString(new_movie)

                except Exception as e:
                    print(f'Error while deserializing: {e}')
                
                movie_dict = {
                    "title": f"{movie.title}",
                    "cast": f"{movie.cast}",
                    "genres": f"{movie.genres}",
                    "runtime": f"{movie.runtime}",
                    "year": f"{movie.year}",
                    "type": f"{movie.type}",
                }
                
                result = self.collection.update_one({'title': movie_title}, {"$set": movie_dict})
                print('updated movie:', movie_title)
                
                if result.modified_count > 0:
                    return SUCCESS.to_bytes(1, 'big')
                
                return FAIL.to_bytes(1, 'big')


            except Exception as e:
                print(f'Error while inserting new movie: {e}')


    def delete_movie(self):
        if self.connected:
            print('deleting movie...')


REQ = 1

SUCCESS = 200
FAIL = 500

CREATE_ID = 1
LIST_ID = 2
UPDATE_ID = 3
DELETE_ID = 4
CLOSE_ID = 5

GENRE_FILTER_ID = 1
CAST_FILTER_ID = 2



"""
Esse código cria uma lista de objetos Movie a partir dos dicionários recebidos na resposta,
e depois cria a mensagem MovieList com a lista de filmes. Por fim, a mensagem é serializada 
em bytes com o método SerializeToString(), que pode ser enviada pela rede.
"""
def movies_dict_to_string(movies_dict):
    if movies_dict == None:
        return 'No movies found'.encode('utf-8')

    try:
        movies = []

        for movie_dict in movies_dict:
            movie = Movie()
            movie.title = movie_dict['title']
            movies.append(movie)

        movie_list = MoviesList()
        movie_list.movies.extend(movies)

        return movie_list.SerializeToString()

    except Exception as e:
        print(f"Error while serializing DB response: {e}")


def handle_client_connection(client_socket, client_address, db_server):
    print('handle_client_connection')
    while True:
        try:
            print('waiting req')
            data = client_socket.recv(1024)
            print('data', data)

            message_type = data[0:1]

            print('message_type', message_type)

            if message_type == REQ.to_bytes(1, 'big'):
                req_type = data[1:2]

                print('req_type', req_type)

                if req_type == CREATE_ID.to_bytes(1, 'big'):
                    client_socket.send('waitingCreate'.encode('utf-8'))

                    print('waiting create data')
                    data = client_socket.recv(1024)
                    print('data', data)

                    response = db_server.create_movie(data)
                    print('response', response)
                    client_socket.send(response)

                if req_type == LIST_ID.to_bytes(1, 'big'):
                    filter_type = data[2:3]
                    print('filter_type', filter_type)


                    filter_size = int.from_bytes(data[3:4], 'big')
                    print('filter_size', filter_size)
                    filter = data[4: 4 + filter_size].decode('utf-8')
                    print('filter', filter)

                    if filter_type == GENRE_FILTER_ID.to_bytes(1, 'big'):
                        movies = db_server.read_movie(['genres', filter])

                        response = movies_dict_to_string(movies)

                        print(response)
                        print('envia')
                        client_socket.send(response)

                    elif filter_type == CAST_FILTER_ID.to_bytes(1, 'big'):
                        movies = db_server.read_movie(['cast', filter])

                        response = movies_dict_to_string(movies)

                        print(response)
                        print('envia')
                        client_socket.send(response)

                if req_type == UPDATE_ID.to_bytes(1, 'big'):
                    movie_title_size = int.from_bytes(data[2:3], 'big')
                    movie_title = data[3:3+movie_title_size].decode('utf-8')

                    movies = db_server.read_movie(['title', movie_title])

                    movie = movies_dict_to_string(movies)

                    response = b'waitingUpdate' + movie

                    client_socket.send(response)

                    print('waiting update data')
                    data = client_socket.recv(1024)
                    print('data', data)

                    response = db_server.update_movie(data, movie_title)
                    print('response', response)
                    client_socket.send(response)

            elif data.decode('utf-8') == 'close':
                print(f'Connection with {client_address} closed.')
                client_socket.send('close'.encode('utf-8'))
                break

        except Exception as e:
            print(f"Error while handling connection: {e}")
            break
    
    print('closed')
    client_socket.close()
    return
            



BUFFER_SIZE = 1024

def main():
    HOST = "127.0.0.1"
    PORT = 52515
    # PORT = 47323
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((HOST, PORT))
    server_socket.listen()
    server_api = Server()
    # server.read_movie(['genres', 'Action'])
    
    print(f"Listening on {HOST}:{PORT}")
    while True:
        client_connection, client_address = server_socket.accept()
        print(f"Accepted connection from {client_address}")
        handle_client_connection(client_connection, client_address, server_api)


if __name__ == '__main__':
    main()