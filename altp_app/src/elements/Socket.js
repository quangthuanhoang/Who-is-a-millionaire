import io from "socket.io-client";
let socket
if(!socket){
 socket = io("http://192.168.40.122:3000")
}

export  {socket}
