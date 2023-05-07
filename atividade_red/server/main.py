import socket

from db_connection import MongoDBClient
from pymongo.errors import PyMongoError
from movie_pb2 import Movie, MoviesList

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
            self.collection.count_documents({})

            print("MongoDB connection established!")
            self.connected = True

        except PyMongoError as e:
            print("Connection failed:")
            print(e)

    def create_movie(self):
        if self.connected:
            print('creating movie...')

    def read_movie(self, filter):
        if self.connected:
            print('reading movie...')
            print('filter', filter)
            filterType = filter[0]
            filterValue = filter[1]

            print(filterType, filterValue)

            movies = self.collection.find({filterType: {'$regex': f'.*{filterValue}.*'}})

            num_documents = self.collection.count_documents({filterType: {'$regex': f'.*{filterValue}.*'}}) # contar documentos

            print(f"{num_documents} documents found.") # exibir número de documentos encontrados

            if num_documents == 0: 
                return None

            return movies

    def update_movie(self):
        if self.connected:
            print('updating movie...')

    def delete_movie(self):
        if self.connected:
            print('deleting movie...')


REQ = 1
RES = 2

CREATE_ID = 1
LIST_ID = 2
UPDATE_ID = 3
DELETE_ID = 4
CLOSE_ID = 5

GENRE_FILTER_ID = 1
CAST_FILTER_ID = 2



def movies_to_string(movies_dict):
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


"""
Esse código cria uma lista de objetos Movie a partir dos dicionários recebidos na resposta,
e depois cria a mensagem MovieList com a lista de filmes. Por fim, a mensagem é serializada 
em bytes com o método SerializeToString(), que pode ser enviada pela rede.
"""
def handle_client_connection(client_socket, client_address, server):
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

                if req_type == LIST_ID.to_bytes(1, 'big'):
                    filter_type = data[2:3]
                    print('filter_type', filter_type)


                    filter_size = int.from_bytes(data[3:4], 'big')
                    print('filter_size', filter_size)
                    filter = data[4: 4 + filter_size].decode('utf-8')
                    print('filter', filter)

                    if filter_type == GENRE_FILTER_ID.to_bytes(1, 'big'):
                        movies = server.read_movie(['genres', filter])

                        response = movies_to_string(movies)

                        print(response)
                        print('envia')
                        client_socket.send(response)

                    elif filter_type == CAST_FILTER_ID.to_bytes(1, 'big'):
                        movies = server.read_movie(['cast', filter])

                        response = movies_to_string(movies)

                        print(response)
                        print('envia')
                        client_socket.send(response)

            elif data.decode('utf-8') == 'close':
                print(f'Connection with {client_address} closed.')
                client_socket.send('close'.encode('utf-8'))
                print('break')
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
    PORT = 4444
    PORT = 7770
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