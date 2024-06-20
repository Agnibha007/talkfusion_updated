document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    let userName = prompt("Enter your name:");

    const messagesContainer = document.getElementById('messages');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const logoutButton = document.getElementById('logout-button');

    // Audio element for playing sound
    const messageSound = new Audio('../assets/ting.mp3');

    // Notify server about the new user
    socket.emit('user joined', userName);

    // Function to append messages to the chat
    const appendMessage = (message, isOwnMessage) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('flex', 'mb-4');
        if (isOwnMessage) {
            messageElement.classList.add('justify-end');
        } else {
            messageElement.classList.add('justify-start');
        }
        
        const messageContent = document.createElement('div');
        const messageClasses = isOwnMessage 
            ? ['bg-gray-300', 'text-gray-700', 'p-3', 'rounded-lg', 'max-w-xs']
            : ['bg-blue-500', 'text-white', 'p-3', 'rounded-lg', 'max-w-xs'];
        messageContent.classList.add(...messageClasses);
        
        messageContent.textContent = message;
        messageElement.appendChild(messageContent);
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    messageForm.addEventListener('submit', event => {
        event.preventDefault();
        const message = messageInput.value;
        if (message) {
            appendMessage(`${userName}: ${message}`, true);
            socket.emit('chat message', { userName, message });
            messageInput.value = '';
        }
    });

    socket.on('chat message', (msg) => {
        appendMessage(`${msg.userName}: ${msg.message}`, false);
        if (msg.userName !== userName) {
            messageSound.play();
        }
    });

    socket.on('user joined', (newUser) => {
        appendMessage(`${newUser} joined the chat`, false);
        messageSound.play();
    });
});

function logoutButtonClick(){
    if (confirm("Are you sure you want to logout?")) {
        window.location.href = 'logout.html';
    }
}