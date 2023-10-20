document.addEventListener('DOMContentLoaded', function () {
    var socket;
    var user;

    // Try to retrieve the user from local storage
    var storedUser = localStorage.getItem('user');
    if (storedUser) {
        user = storedUser;
        setupChat();
    }

    function setupChat() {
        socket = io.connect('http://' + document.domain + ':' + location.port);

        socket.on('message', function (data) {
            var messageContainer = document.getElementById('messages');
            var messageDiv = document.createElement('div');
            
            messageDiv.className = data.user === user ? 'my-message' : 'other-message';

            var usernameDiv = document.createElement('div');
            usernameDiv.className = data.user === user ? 'myusername' : 'otherusername';
            usernameDiv.innerHTML = data.user + ':';
            messageDiv.appendChild(usernameDiv);

            var messageTextDiv = document.createElement('div');
            messageTextDiv.className = 'message-text';
            messageTextDiv.innerHTML = data.msg;
            messageDiv.appendChild(messageTextDiv);

            messageContainer.appendChild(messageDiv);
            messageContainer.scrollTop = messageContainer.scrollHeight;
        });

        socket.on('user_joined', function (message) {
            var messageContainer = document.getElementById('messages');
            var userJoinedDiv = document.createElement('div');
            userJoinedDiv.className = 'center-message';
            userJoinedDiv.innerHTML = message;
            messageContainer.appendChild(userJoinedDiv);
            messageContainer.scrollTop = messageContainer.scrollHeight;
        });

        document.getElementById('send').onclick = function () {
            var messageInput = document.getElementById('message');
            var message = messageInput.value.trim();

            if (message !== '') {
                socket.send({ msg: message, user: user });
                messageInput.value = '';
            } else {
                alert('Please enter a message before sending.');
            }
        };

        var room = 'general';

        socket.emit('join', { room: room, user: user });

        window.onbeforeunload = function () {
            socket.emit('leave', { room: room, user: user });
        };

        document.getElementById('username-form').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
    }

    document.getElementById('submit-username').onclick = function () {
        var usernameInput = document.getElementById('username');
        var username = usernameInput.value.trim();

        if (username !== '') {
            user = username;
            // Store the user in local storage
            localStorage.setItem('user', user);
            setupChat();
        } else {
            alert('Please enter a valid username.');
        }
    };
});
    