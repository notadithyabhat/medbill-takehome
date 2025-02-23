const express = require('express');
const app = express();

app.use(express.json());

const caseRoutes = require('./routes/caseRoutes');
app.use('/cases', caseRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'test' });
});

module.exports = app;



