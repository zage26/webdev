const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const classSchema = mongoose.Schema({
  className: {
    type: String,
    required: true,
    unique: true
  },
  presentGrade: {
    type: Number,
    required: true
  },
  wantedGrade: {
    type: Number,
    required: true
  },
  percentTest: {
    type: Number,
    required: true
  },
  neededGrade: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true
  }
})

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
