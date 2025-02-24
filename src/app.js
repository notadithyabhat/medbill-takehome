const express = require('express');
const app = express();
const http = require('http');


app.use(express.json());

const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {cors: {origin: '*'}});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});

const caseRoutes = require('./routes/caseRoutes');
const messageRoutes = require('./routes/messageRoutes');
app.use('/cases', caseRoutes);
app.use('/cases', messageRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'test' });
});

module.exports = app;



