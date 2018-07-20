//Put all of your routes in one place
const express = require("express");
//instantiating an instance of the router object
const authRoute = express.Router();
const User = require("../models/user.js");
const { body, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const bcrypt = require('bcryptjs');
const {validateUser} = require("../middleware/middleware.js");

//need next so that the information can be passed on
// const logger = (req, res, next) => {
//   console.log("This is our custom middleware");
//   console.log("email", req.body.email);
//   req.body.email = "email@something.com";
//   req.body.school = "Paly"
  // console.log("body", req.body);
  // next();
// }


authRoute.get("/register", (req, res) => {
  // console.log(req.flash("error"));
  // console.log("local variables:", res.locals);
  res.render("register");
})

//put middleware in front of route
authRoute.get("/home", validateUser, (req, res) => {
  console.log("userId:", req.session.userId);
  res.render("home");
})

//validate on the front-end
//express-validator, specific for forms
//specific middleware for this route only
authRoute.post("/register", [
    //checks given parameter
    body("email")
      //checks if email
      .isEmail()
      //if not display:
      .withMessage("Invalid email address."),
      // .custom(email => {
      //   User.findOne({email: email})
      //     .then(user => {
      //       if (user) {
      //         return false;
      //       }
      //     })
      //     .catch(e => {
      //       return true;
      //     })
      // })
      // .withMessage("This email is already in use"),
    body("password")
      //checks length of parameter
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/\d/)
      .withMessage("Password must contain at least one digit")
  ],
  (req, res) => {
    // Get the validation result whenever you want; see the Validation Result API for all options!
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //map iterates through an array of items (original unchanged)
      //each item --> do whatever you want, and make new array with modified object
      const errorMessages = errors.array().map(obj => {
        return {message: obj.msg};
      });
      //return --> terminates the program
      console.log("Original Errors:", errors.array());
      console.log("Mapped Errors:", errorMessages);
      //errors.array() = array of objects
      req.flash('errorMessages', errorMessages);
      // console.log(req.flash('errorMessages', errorMessages));
      //on redirect --> set a session cookie, with an id
      //when it gets to the other side, pulls it out of the flash and use data
      return res.redirect("/register");
    }
    // matchedData returns only the subset of data validated by the middleware
    const userData = matchedData(req);
    //make new user with given data
    const user = new User(userData);
    user.save()
        .then(user => {
          // console.log(user);
          //successful user
          req.flash('successMessage', {message: "Sign up successful!"});
          res.redirect("/login");
        })
        .catch(e => {
          // console.log(e.code);
          if(e.code === 11000) {
            // console.log("Duplicate email");
            req.flash("errorMessages", {message: "Duplicate email"})
          }
          res.redirect("/register");
        })
})

authRoute.get("/login", (req, res) => {
  res.render("login");
})

//checking validity of login
authRoute.post("/login", (req, res) => {
  console.log("Post login route hit");
  User.findOne({email: req.body.email})
      .then(user => {
        if(!user) {
          req.flash("errorMessages", {message: "This email does not exist."});
          return res.redirect("/login");
        } else {
          bcrypt.compare(req.body.password, user.password)
            .then(passwordIsValid => {
              console.log("Password is valid: ", passwordIsValid);
              if(passwordIsValid) {
                //cookie is send with redirect/request :)
                req.session.userId = user._id;
                // console.log("userID in session:", user._id);
                res.redirect("/home");
              } else {
                req.flash("errorMessages", {message: "Invalid password."});
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
        return res.redirect("/login");
      })
})

authRoute.post("/logout", (req, res) => {
  req.session.userId = undefined;
  res.redirect("/login");
})

module.exports = authRoute;
