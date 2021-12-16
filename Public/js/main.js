const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const ChannelName = document.getElementById('room-name');
const memberList = document.getElementById('user');



//uses querystring library to parse url information such as username and room
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true //ignores prefixes to only grab username and room name

});
const socket = io();

console.log(username, room);


//
socket.emit('joinRoom',{username, room});

//get room and user information
socket.on('joinRoom',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

//message from server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    //chat window will scroll down to most recent message
    chatMessages.scrollTop = chatMessages.scrollHeight;

});


//message submit
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const msg = e.target.elements.msg.value; //getting event type by id

    //emitiing a message to server
    socket.emit('chatMessage',msg);

    //clears input 
    e.target.elements.msg.value = '';
    e/target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message){
    const div = document.createElement('div');//creates a div 
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);//appends messages to chat 
}

//Add room name to DOM
function outputChannelName(room){
    ChannelName.innnerText = room;
}
//Add Memebers to the DOM
function outputUsers(users){
    memberList.innerHTML = `
    ${users.map(user=> `<li>${user.username}</li>`).join('')}`;
}