const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
//new item: express-handlebars, different from hbs
const exphbs = require("express-handlebars");

const authRoute = require("./routes/authRoute.js");
const mongoose = require("./db/mongoose.js");
const morgan = require("morgan");

//session cookie
const session = require("express-session");
//flash cookie (need session for flash)
const flash = require("connect-flash");
//looks for a file in root directory, called .env
//will then parse those variables into environemnt variables
require("dotenv").config();

const port = process.env.PORT || 3000;

const app = express();

//view engine
app.set("views", path.join(__dirname, "views"));
//define specifically what we want to call the engine
//renaming hbs engine to connect to our new exphbs
app.engine("hbs", exphbs({defaultLayout : "main",
                          extname       : ".hbs"}));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  //render Layout first
  res.render("index.hbs");
})

// app.get("/register", (req, res) => {
//   res.render("register.hbs")
// })

//Middleware for cookies
//Put into req object: req.session.(something)
//set properties under session
app.use(session({
  //encrypt and decrypt back and forth
  //only do this with secret key --> PUT IN ENVIRONMNET VARIABLE
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  //securing the cookie!!
  //should be on https
  cookie: {secure: false}
}));
//Put into req object: req.flash.(something)
//relies on session --> make a session cookie that deleted fast
//need to place session b  fore flash
app.use(flash());
//custom middleware, run before every route
//Middleware
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));


app.use((req, res, next) => {
  //makes and sets new local variable
  res.locals.errorMessages = req.flash('errorMessages');
  res.locals.successMessage = req.flash('successMessage');
  next();
  //dont need to set in the route
})


//anything that is /users, uses the users.js information
//Mount Routes
//Ex) http://localhost:3000/users/register
// app.use("/users", usersRoute);
app.use("/", authRoute);


app.listen(port, () => {
  console.log(`Web server up on port ${port}`);
})
