# Install
Run this command in repo/server:
pip3 install -r requirements.txt

#### generate code
/representacao-externa-dados/atividade_rpc/server$ python3 -m grpc_tools.protoc -I ../proto --python_out=. --grpc_python_out=. ../proto/movie.proto 

# Run
Run this command in repo/server:
python3 main.py

# tests with grpcurl
grpcurl -plaintext -d '{"message": "alex"}' localhost:50051 teste.MovieService/ListMoviesByCast
grpcurl -plaintext -d '{"title": "filminho"}' localhost:50051 teste.MovieService/CreateMovie


# Libraries
- dotenv: is a third-party library that provided a way to load environment variables like DB user and password.
- movie_pb2: code generated through a proto file with an interface for movies
- movie_pb2_grpc: code generated through a proto file with servicer and interfaces
- pymongo.errors: used to PyMongoError throw database errors
- Flask - flask_cors: for developing web applications and APIs. i tried to use this to make a connection middleware because of the CORS
         issue i had, didn't work (i don't know why, butt wanted to leave it here to show i tried XD)
- concurrent.futures: provides a high-level interface for asynchronously executing functions using threads or processes 
- MessageToJson: used to convert protobuf into a json
- grpc: used to create a gRPC server 