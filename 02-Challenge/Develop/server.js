const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const uuid = require('./public/assets/js/uuid');

const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.send('')
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => res.json(db));

app.post('/api/notes', (req, res) => {

});

app.listen(PORT, () =>
  console.log(`http://localhost:${PORT}`)
);