const chatform = document.getElementById('chat-form');
const chatmsgs = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get user name and Room
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});

const socket = io();

//Join the room
socket.emit('joinroom',  {username, room});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

socket.on('message', message => {
    outputmsg(message);

    //Scroll down
    chatmsgs.scrollTop = chatmsgs.scrollHeight;
});

chatform.addEventListener('submit', e => {
    e.preventDefault();

    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
      return false;
    }

    socket.emit('chatmsg', msg);

    //Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Output msg to DOM
function outputmsg(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
  }
  
  // Add users to DOM
  function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerHTML = `&nbsp;<span style="color:green;">●</span>&nbsp;${user.username}`;
      userList.appendChild(li);
    });
  }
  
  //Prompt the user before leave chat room
  document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });