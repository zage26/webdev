//Imported stuff
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const { body, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const bcrypt = require('bcryptjs');

const path = require("path");
const morgan = require("morgan");

const session = require("express-session");
const flash = require("connect-flash");

const User = require("./models/user.js");
const mongoose = require("./db/mongoose.js");
const {validateUser} = require("./middleware/middleware.js");

require("dotenv").config();

const port = process.env.PORT || 3000;

const app = express();

app.set("views", path.join(__dirname, "views"));

app.engine("hbs", exphbs({ defaultLayout : "main",
                           extname       : ".hbs" }));

app.set("view engine", "hbs");

app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}))

app.use(flash());

app.use((req, res, next) => {
  res.locals.errorMessages = req.flash("errorMessages");
  res.locals.successMessage = req.flash("successMessage");
  next();
})

app.use(bodyParser.urlencoded({ extended: true}));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.render("index.hbs");
})

app.get("/register", (req, res) => {
  res.render("register.hbs");
})

app.get("/login", (req, res) => {
  res.render("login.hbs");
})

app.post("/register", [
  body("email")
    .isEmail()
    .withMessage("Must be a valid email."),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters.")
    .matches(/\d{2}/)
    .withMessage("Must have at least 2 digits back to back.")
],
(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const errorMessages = errors.array().map(obj => {
      return {message: obj.msg};
    })
    req.flash("errorMessages", errorMessages);
    res.redirect("/register");
  }
  const userData = matchedData(req);
  console.log(userData);
  const user = new User(userData);
  user.save()
    .then(user => {
      req.flash("successMessage", {message: "Sign up successful!"});
      res.redirect("/login");
    })
    .catch(e => {
      if(e.code === 11000) {
        req.flash("errorMessages", {message: "Duplicate email."});
      }
      res.redirect("/register");
    })
});

app.get("/home", validateUser, (req, res) => {
  // const userEmail = "";
  // User.findById({id: req.session.userId})
  //   .then(user => {
  //     userEmail = user.email;
  //   })
  //   .catch(e => {
  //     console.log(e);
  //   })
  res.render("home.hbs");
})


app.post("/login", (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if(!user) {
        req.flash("errorMessages", {message: "This email does not exist."});
        return res.redirect("/login");
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then(passwordIsValid => {
            if(passwordIsValid) {
              console.log(user._id);
              // req.session.userId = user._id;
              res.redirect("/home");
            } else {
              req.flash("errorMessages", {message: "Invalid Password."})
              res.redirect("/login");
            }
          })
          .catch(e => {
            console.log(e);
          })
      }
    })
    .catch(e => {
      req.flash("errorMessages", {message: e});
      res.redirect("/login");
    })
})

app.post("/logout", (req, res) => {
  req.session.userId = undefined;
  res.redirect("/login");
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
