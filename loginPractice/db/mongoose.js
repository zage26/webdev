const mongoose = require("mongoose");

const database = process.env.MONGOD_URI || 'mongodb://localhost:27017/loginPractice';

mongoose.connect(database)
  .then(() => {
    console.log("Successful connection to database.");
  })
  .catch(e => {
    console.log("Could not connect to database.");
  })

  module.exports = mongoose;
