# Install
Run these commands in `repo/client_react`:
  npm install
  npm run dev
  
- If you want to generate code, you can run this command:
sudo npm install -g protoc-gen-grpc-web
/representacao-externa-dados/atividade_rpc/client_react$ /representacao-externa-dados/atividade_rpc/client_react$ protoc -I=../proto --js_out=import_style=commonjs:. --grpc-web_out=import_style=commonjs,mode=grpcwebtext:. ../proto/movie.proto



rxjs -> arquivo gerado
grpc-web -> conexao