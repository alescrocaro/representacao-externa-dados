from flask import Flask, request
from flask_cors import CORS
from grpc import insecure_channel

import movie_pb2_grpc

app = Flask(__name__)
CORS(app)
print('flask')
@app.route('/teste.MovieService/ListMoviesByCast', methods=['POST'])
def list_movies_by_cast():
    data = request.get_data()
    print(data)
    
    channel = insecure_channel('localhost:50051')
    stub = movie_pb2_grpc.MovieServiceStub(channel)
    
    response = stub.ListMoviesByCast(data)
    
    return response, 200
#.SerializeToString()
if __name__ == '__main__':
    app.run(port=8000)