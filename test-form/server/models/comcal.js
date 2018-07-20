const mongoose = require("mongoose");

const comCalSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      minLength: 5,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      trim: true
    }
  });

const ComCalUser = mongoose.model("ComCalUser", comCalSchema)

module.exports = { ComCalUser }
