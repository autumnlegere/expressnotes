const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./public/assets/js/uuid');
// convention
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// post creates new note
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  console.log({ title, text });
  console.log(req.body)
  if (title && text) {
  const newNote = {
      title,
      text,
      id: uuid(),
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        var parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
          (writeErr) => writeErr ? console.error(writeErr) : console.info('Successfully updated notes.')
          );
      };
    });

    const response = {
      status: 'Success',
      body: newNote,
    };

    console.log(response);
    res.status(200).json(response);
  } else {
    res.status(500).json('Error in posting New Note')
  };
});

// * `DELETE /api/notes/:id` should receive a query parameter that contains the id of a note to delete. To delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
// app.delete('/api/notes/id', (req, res) => {
//   fs.readFile('./db/db.json', 'utf8', (err, data) => {
//     if (err) {
//       console.log(err);
//     } else {
//       var parsedNotes = JSON.parse(data);
//       const removeNote = parsedNotes.filter(note => note.id !== parseInt(req.params.id));

//       fs.writeFile('./db/db.json', JSON.stringify(removeNote, null, 4),
//       (writeErr) => writeErr ? console.error(writeErr) : console.info('Successfully updated notes.')
//       );
//     };
//   });
// })

// app.get('/api/notes/id', (req, res) =>{
//   console.log('Hello')
//       res.json(parsedNotes[req.params.id]);
// });

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      var parsedNotes = JSON.parse(data);
      res.json(parsedNotes);
    };
  });
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// needs to go below all other routes
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, 'public/index.html'))
// );

app.listen(PORT, () =>
  console.log(`http://localhost:${PORT}`)
);