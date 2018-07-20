const mongoose = require("mongoose");

const database = 'mongodb://localhost:27017/semtwofinal';

mongoose.connect(database)
  .then(() => {
    console.log("Successful connection.");
  })
  .catch(e => {
    console.log("Failed connection.");
  })

  module.exports = mongoose;
