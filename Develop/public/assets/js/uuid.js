// Immediately export a function that generates a string of random numbers and letters
// Used in server.js to create unique id for each new note
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
