const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  //What we want each object to have
  text: {
    //options of how you want it
    //One type
    type: String,
    //make required
    required: true,
    //must be at least on character
    minLength: 1,
    //if extra whitespace, trims it off
    trim: true
  },
  completed: {
    type: Boolean,
    //not tell if completed --> default
    default: false
  },
  completedAt: {
    //Can do this with Dates (check this out later)
    type: Number,
    default: null
  }
  });
  //can have the value itself be an object and
  //then can have stuff in it
  //MORE COMPLEX
  // name: {
  //   first: String,
  //   last: String
  // }

  //Instatiating it as a 'model' accesses all reading
  //and writing functions (Do singular and capitalized)
  //Instantiate: pass it a name and schema
  const Todo = mongoose.model("Todo", todoSchema)
  //Can do all CRUD operations

  //short hand for "  module.exports = { Todo: Todo }"
  module.exports = { Todo }
