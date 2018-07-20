//Taking entire thing
const express = require("express");
//parses through data --> chops up data into packages (one way stream);
const bodyParser = require('body-parser');
const _ = require("lodash");
const hbs = require("hbs");

//part of node
const path = require("path");

//pulling out property
//destructuring assignment
const {mongoose} = require("./db/mongoose.js");
const {Todo} = require("./models/todo.js");

//post man --> nice user interface to use for hhtp requests

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../views"));

//~Middleware~
//anytime something comes in, you need to parse the data
//parse body into nice easy javascript thing, JSON --> Javascript
//chops it into an object --> nice properties --> easy access
// app.use(bodyParser.json());

//for a form
app.use(bodyParser.urlencoded({
  extended: true
}))

//Creating own middleware *look below*
// app.use((req, res, next) => {
//   req.body = {};
//   next();
// })

//If we push to heroku
const port = process.env.PORT || 3000;

//When using post --> the body has a request

//securely passes data
//bc post --> you have to pass it something/data
app.post('/todos', (req, res) => {
  console.log(req.body);
  const todo = new Todo({
    //match the params given
    text: req.body.todoText,
    completed: req.body.todoCompleted
  })
  //returns a promise
  todo.save()
    .then(doc => {
      //send a response --> or render
      //usually render a new page/another page
      res.send(doc);
    }, e => {
      //changing static number
      //watch static codes
      res.status(404).send(e);
    })
  // res.send(req.body);
})

app.get("/todos", (req, res) => {
  //look up mongoose methods
  //finds them all
  Todo.find()
      .then(todos => {
        //better to store in an object
        res.send({
          todos: todos
        });
        //or res.send({todos});
      }, e => {
        res.status(404).send(e);
      })
})

app.get("/todos/new", (req, res) => {
  res.render("./todos/new.hbs");
})

app.get("/todos/:id/edit", (req, res) => {
  const id = req.params.id;
  res.render("./todos/edit.hbs", {id});
})

app.get("/todos/:id", (req, res) => {
  //5ab2bbc9b2be960c0934cee7
  //rec.query() or rec.params()
  //anything typed in place of id = id param
  const id = req.params.id;
  //or rec.params.id
  //2 DIF WAYS TO COMMUNICATE ON GET requests: params and queries
      //todos/:id/:name --> rec.params.id
        //ex) todos/123/zage --> rec.params.id = 123 and rec.params.name = zage
      //todos?school=paly --> rec.query.school
  Todo.findById(id)
    //could have done Todo.find({_id: "1290309123091203"});
      .then(todo => {
        //send back AS AN OBJECT
        res.send({todo});
      }, e => {
        res.status(404).send(e);
      })
})

//delete
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  Todo.findByIdAndRemove(id)
      .then(todo => {
        res.send({todo});
      }, e => {
        res.status(404).send(e);
      })
})

//update
//patch -- making small change to one thing
app.patch("/todos/:id", (req, res) => {
  //also contain a body, need to send changes
  const id = req.params.id;
  // const body = req.body; --> not the best if idea
    // DONT USE THE ENTIRE BODY EVER
    //use helper method to only pick out properties you want
    //Use lo-dash!
  const body = _.pick(req.body, ["text", "completed"]);
//when its completed --> time stamp it
  if(_.isBoolean(body.completed) && body.completed) {
    //getting a time
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  //takes three args
  Todo.findByIdAndUpdate(id, {
    //resetting
    $set: body
    //send the edited one back
  }, {new: true})
      .then(todo => {
        if(!todo) {
          res.status(404).send();
        } else {
            res.send({todo});
        }
      }, e => {
        res.status(404).send(e);
      })
})

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
})
