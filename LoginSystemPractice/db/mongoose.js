const mongoose = require("mongoose");

const database = process.env.MONGOD_URI || 'mongodb://localhost:27017/LoginSystemPractice';

mongoose.connect(database)
  .then(() => {
    console.log("Successful connection");
  })
  .catch(e => {
    console.log("Could not connect to database");
  })

module.exports = mongoose;
