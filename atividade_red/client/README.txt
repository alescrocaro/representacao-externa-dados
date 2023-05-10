# Install
Run these commands in repo/client:

npm i

- If you want to generate code, you can run this command:
protoc --js_out=import_style=commonjs,binary:. --proto_path=../client ../movie.proto



# Run
Run these commands in repo/client:
node main.js



# Libraries
- net: is a built-in Node.js library for creating a TCP connection with the server using socket.
- prompt-sync: third-party library that provides a synchronous way to get user input from command line.
- movie_pb: code generated through a proto file with an interface for movies



# Usage
run the main.js, then choose a command by typing 'list' in terminal (for example) and press enter,
then type 'actor' and press enter, then type 'John' and press enter, you should see a list of movie titles