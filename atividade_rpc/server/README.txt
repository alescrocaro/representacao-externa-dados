# Install
Run this command in repo/server:
pip3 install -r requirements.txt

/representacao-externa-dados/atividade_rpc/server$ python3 -m grpc_tools.protoc -I ../proto --python_out=. --grpc_python_out=. ../proto/movie.proto 

# Run
Run this command in repo/server:
python3 main.py


# Libraries
- dotenv: is a third-party library that provided a way to load environment variables like DB user and password.
- movie_pb: code generated through a proto file with an interface for movies
- pymongo.errors: used to PyMongoError throw database errors
- socket: is a built-in python library for creating a TCP connection with the client using socket.


# tests with grpcurl
grpcurl -plaintext -d '{"message": "alex"}' localhost:50051 teste.MovieService/ListMoviesByCast
