const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator/check");
const { matchedData } = require("express-validator/filter");
require("dotenv").config();
const User = require("./models/user.js");
const mongoose = require("./db/mongoose.js");
const { validateUser } = require("./middleware/middleware.js");

const port = process.env.PORT || 3000;
const app = express();

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", exphbs({ defaultLayout : "main",
                           extname : ".hbs" }));
app.set("view engine", "hbs");

app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false}
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.errorMessages = req.flash("errorMessages");
  res.locals.successMessage = req.flash("successMessage");
  next();
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.render("index.hbs");
})

app.get("/register", (req, res) =>{
  res.render("register.hbs");
})

app.post("/register", [
  body("email")
  .isEmail()
  .withMessage("Need a valid email"),
  body("password")
  .isLength({ min: 4 })
  .withMessage("Password needs to be at least 4 chars")
  .matches(/\d/)
  .withMessage("Password must contain at least one digit")
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const errorMessages = errors.array().map(obj => {
      return {message: obj.msg}
    })
    req.flash("errorMessages", errorMessages);
    res.redirect("/register");
  } else {
    const userData = matchedData(req);
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
  }
})


const getEmail = (id) => {
  User.findOne({_id: id})
    .then(user => {
      console.log(user.email);
      return user.email;
    })
    .catch(e => {
      console.log(e);
    })
}

app.get("/home", validateUser, (req, res) => {
  const hey = getEmail(req.session.userId);
  console.log(hey);
  res.render("home.hbs", {
    userEmail: getEmail(req.session.userId)
  });
})

app.post("/logout", (req, res) => {
  req.session.userId = undefined;
  res.redirect("/login");
})

app.get("/login", (req, res) =>{
  res.render("login.hbs");
})

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user) {
        req.flash("errorMessages", {message: "This email does not exist."});
        res.redirect("/login");
      }
      else {
        bcrypt.compare(req.body.password, user.password)
          .then(passwordIsValid => {
            if(passwordIsValid) {
              req.session.userId = user._id;
              res.redirect("/home");
            }
            else {
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
       req.flash("errorMessages", {message: e});
       res.redirect("/login");
     })
})

app.listen(port, () => {
  console.log(`Listening on ${port}`);
})
