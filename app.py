from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecretkey'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(message):
    send({'msg': message['msg'], 'user': message['user']}, broadcast=True)

@socketio.on('user_joined')
def handle_user_joined(user):
    emit('user_joined', f'{user} has joined the chat', broadcast=True)

@socketio.on('join')
def handle_join(data):
    user = data['user']
    emit('user_joined', f'{user} has joined the chat', broadcast=True)

if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0' ,debug=True)
