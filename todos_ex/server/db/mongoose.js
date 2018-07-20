//JUST HAVE CODE FROM SERVER THAT MAKES CONNECTION
const mongoose = require("mongoose");

//force it to return a promise/normal node version of promise
mongoose.Promise = global.Promise;

//localhost/#/(database name)
mongoose.connect('mongodb://localhost:27017/TodoApp');

//NEED TO HAVE THIS!
module.exports = { mongoose }
