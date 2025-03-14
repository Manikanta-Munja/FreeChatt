var socket = io("http://localhost:8000");

const form = document.getElementById("sender");
const messageInput = document.getElementById("sendmsg");
const messageContainer = document.querySelector(".container");
var audio =new Audio('ting.mp3');

 const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play().catch(error => console.log("Audio playback was blocked:", error));
    }


 }

 form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message =messageInput.value;
    append(`you: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value='';

 })
const Name = prompt("Enter your name to join");

if (Name) {
    socket.emit("new-user-joined", Name);
}

socket.on("user-joined", Name => {
    append(`${Name} has joined the chat`,'right');
    console.log(`${Name} has joined the chat`);
});
socket.on('receive', data => {
    append(`${data.Name}: ${data.message}`, 'left');
  });
  socket.on('left',Name=>{
    append(`${Name} left the chat`,'left');
  })
  