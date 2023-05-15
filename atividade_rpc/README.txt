group:
  Alexandre Aparecido Scrocaro Junior RA: 2135485,
  Pedro Klayn RA:2171490

client and server has its own README



/representacao-externa-dados/atividade_rpc/client$ protoc -I=../proto --js_out=import_style=commonjs:. --grpc-web_out=import_style=commonjs,mode=grpcwebtext:. ../proto/movie.proto
/representacao-externa-dados/atividade_rpc/server$ python3 -m grpc_tools.protoc -I ../proto --python_out=. --grpc_python_out=. ../proto/movie.proto 