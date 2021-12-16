const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, memberDisconnects, getChannelMembers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder 
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Admin'

//Run when client connects 
io.on('connection', socket =>{
    socket.on('joinRoom',({username, room}) => {
        const user = userJoin(socket.id, username, room); //obtains the id of room joined and user
        
        socket.join(user.room);

         //Welcome current user 
    socket.emit('message',formatMessage(botName, 'welcome to Discordclone'));

    //Announces when user has entered the chat  
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,  `${user.username}  has joined the chat`)
    ); //.to emits to a specific room as opposed to all
    
    //updates which users and which room is in use
    io.to(user.room).emit('channelmembers',{
        room: user.room,
        users: getChannelMembers(user.room)
    });


   
    // revieves chat messages 
    socket.on('chatMessage',msg=>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username, msg));
    });
   
    //Runs when client disconnects 
    socket.on('disconnect', ()=>{
        const user = memberDisconnects(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName, ` ${user.username} has left the chat`)
                );

                //updates which users and which room is in use
    io.to(user.room).emit('channelmembers',{
        room: user.room,
        users: getChannelMembers(user.room)
    });

        }

        
    });
    });
    console.log('New WS Connection...');
    
    
   

   
    
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on ${PORT} `));