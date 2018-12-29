const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

let usersockets = {}

app.use('/', express.static(path.join(__dirname,'frontend')))

io.on('connection', (socket) => {
    console.log("New Socket formed from " + socket.id)
    socket.emit('connected')
    
    socket.on('login', (data) => {
        //user name is data.user
        usersockets[data.user] = socket.id
    })
    socket.on('send_msg',(data) => {
        // if we use io emit data is recieved by us as well
        if(data.message.startsWith('@'))
        {
            let recipient = data.message.split(':')[0].substr(1)
            let recipientsocket = usersockets[recipient]
            io.to(recipientsocket).emit('recv_msg',data)
        }
        else
        {
            socket.broadcast.emit('recv_msg',data)
        }
    })
})

server.listen(2345, () => {
    console.log('Website open on http://localhost:2345')
})