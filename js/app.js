// const socket = io('http://localhost:8000');
const socket = io('ws://localhost:3500')


const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container')
var audio = new Audio('ting.mp3');




const append = (message, position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }

}

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''

})

// document.getElementById('joinButton').addEventListener('click', () => {
//     const name = prompt("Enter your name to join the chat");

//     if (name) {
//         // Emit the 'user-joined' event with the entered name
//         socket.emit('new-user-joined', name);
//     }
// });


const name = prompt("Enter your name to join the chat");
socket.emit('new-user-joined', name);

socket.on('new-user-joined', name =>{
    append(`${name} joined the chat`, 'left')
})

socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})
socket.on('left', name =>{
    append(`${name} left the chat`, 'left')
})