const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const bcrypt = require("bcryptjs");
const hbs = require("hbs");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const { body, validationResult } = require("express-validator/check");
const { matchedData } = require("express-validator/filter");
require("dotenv").config();
const User = require("./models/user.js");
const mongoose = require("./db/mongoose.js");
const { validateUser } = require("./middleware/middleware.js");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, "views"));
app.engine("hbs", exphbs({ defaultLayout : "main",
                           extname       : ".hbs"}));
app.set("view engine", "hbs");

app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(flash());

app.use((req, res, next) => {
  res.locals.errorMessages = req.flash("errorMessages");
  res.locals.successMessage = req.flash("successMessage");
  next();
})

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.hbs");
})

app.get("/register", (req, res) => {
  res.render("sign-up.hbs");
})

app.post("/register", [
  body("email")
    .isEmail()
    .withMessage("Must have a valid email."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 5 characters.")
    .matches(/\d{2}/)
    .withMessage("Password must have two least one digit.")
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const errorMessages = errors.array().map(obj => {
      return {message: obj.msg};
    })
    req.flash("errorMessages", errorMessages);
    res.redirect("/register");
  } else {
    const userData = matchedData(req);
    const user = new User(userData);
    user.save()
      .then((user) => {
        req.flash("successMessage", {message: "Sign up successful!"});
        res.redirect("/login");
      })
      .catch(e => {
        if(e.code === 11000) {
          req.flash("errorMessages", {message: "Duplicate email."});
          res.redirect("/register");
        }
      })
  }
})

app.get("/login", (req, res) => {
  res.render("login.hbs");
})

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user) {
        req.flash("errorMessages", {message: "This email does not exist."});
        res.redirect("/login");
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then(passwordIsValid => {
            if(passwordIsValid) {
              req.session.userId = user._id;
              res.redirect("/home");
            } else {
              req.flash("errorMessages", {message: "Invalid Password."});
              res.redirect("/login");
            }
          })
          .catch(e => {
            console.log(e);
          })
      }
    })
    .catch(e => {
      req.flash("errorMessages", {message: "Error:", e});
      res.redirect("/login");
    })
})

app.get("/home", validateUser, (req, res) => {
  console.log("User: ", req.session.userId);
  User.findOne({ _id: req.session.userId })
    .then(user => {
      console.log(user.email);
      res.render("home.hbs", {
        userEmail: user.email
      });
    })
    .catch(e => {
      console.log(e);
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
