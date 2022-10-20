// require dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

// require uuid function for creating unique id's for each new note
const uuid = require('./public/assets/js/uuid');

// convention for express and variable for local port
const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// creates new note
app.post('/api/notes', (req, res) => {
  // deconstruct body
  const { title, text } = req.body;
  // if title and text are present, save new note with id as well
  if (title && text) {
  const newNote = {
      title,
      text,
      id: uuid(),
    };
    // read json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        // save json data as new variable, add new note into it, write json file with new, updated data
        var parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
          (writeErr) => writeErr ? console.error(writeErr) : console.info('Successfully updated notes.')
          );
      };
    });
    // response returns success and content of new note
    const response = {
      status: 'Success',
      body: newNote,
    };
    // successful response returns status of 200
    res.status(200).json(response);
  } else {
    // unsuccessful response returns status of 500
    res.status(500).json('Error in posting New Note')
  };
});

// **** Code for app.delete; I didn't get it to work, but this is the beginnings of the code *****

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

// read current json file content
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

// route to send user to notes.html file
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// any unrecognized route will send user to index.html file
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// listener for local port
app.listen(PORT, () =>
  console.log(`http://localhost:${PORT}`)
);