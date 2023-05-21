# Install
Run these commands in `repo/client_react`:
  npm install
  
- If you want to generate code, you can run this command:
sudo npm install -g protoc-gen-grpc-web
/representacao-externa-dados/atividade_rpc/client_react$ /representacao-externa-dados/atividade_rpc/client_react$ protoc -I=../proto --js_out=import_style=commonjs:. --grpc-web_out=import_style=commonjs,mode=grpcwebtext:. ../proto/movie.proto



# It's not working.
Couldn't find a way to fix the CORS issue: 
cess to XMLHttpRequest at 'http://localhost/teste.MovieService/ListMoviesByCast' from origin 'http://localhost:3000' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' 
header is present on the requested resource.



grpc-web -> conexao





alescrocaro@alescrocaro-X570DD:~/Documentos/representacao-externa-dados/atividade_rpc/sera$ sudo systemctl start nginx
alescrocaro@alescrocaro-X570DD:~/Documentos/representacao-externa-dados/atividade_rpc/sera$ sudo systemctl status nginx