// const io= require('socket.io')(8000);
// const cors= require('cors');



import express from 'express'
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3500
const ADMIN = "Admin"

const app = express()

app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

// state 
// const UsersState = {
//     users: [],
//     setUsers: function (newUsersArray) {
//         this.users = newUsersArray
//     }
// }

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

const users={};

io.on('connection', (socket) =>{

    
    socket.on('new-user-joined',(name) =>{
        // console.log(`${name} has joined the chat.`);
        users[socket.id]=name;
        // io.emit('user-joined', name);
        socket.broadcast.emit('new-user-joined',name);
    });

    // users[socket.id]='ishank';


    // socket.on('new-user-joined',(name) =>{
    //     socket.broadcast.emit('new-user-joined',name);
    // });

    socket.on('send',message =>{
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]})
    });
    
    socket.on('disconnect',name =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id]
    });

})