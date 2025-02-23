const express = require('express');
const app = express();

app.use(express.json());

const caseRoutes = require('./routes/caseRoutes');
const messageRoutes = require('./routes/messageRoutes');
app.use('/cases', caseRoutes);
app.use('/cases', messageRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'test' });
});

module.exports = app;



