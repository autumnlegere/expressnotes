const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const uuid = require('./public/assets/js/uuid');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/api/notes', (req, res) => {
  fs.readFile(db, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      var parsedNotes = JSON.parse(data);
      res.JSON(parsedNotes);
    };
  });
});

app.post('/api/notes', (req, res) => {
  const { noteTitle, noteText } = req.body;
  if (noteTitle && noteText) {
    const newNote = {
      noteTitle,
      noteText,
      id: uuid(),
    };
    fs.readFile(db, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        var parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile(db, JSON.stringify(parsedNotes, null, 4),
          (writeErr) => writeErr ? console.error(writeErr) : console.info('Successfully updated notes.')
          );
      };
    });

    const response = {
      status: 'Success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting New Note')
  };
});

    app.listen(PORT, () =>
      console.log(`http://localhost:${PORT}`)
    );