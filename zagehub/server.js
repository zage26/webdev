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
const Class = require("./models/class.js");
const mongoose = require("./db/mongoose.js");
const methodOverride = require("method-override");
const nodemailer = require('nodemailer');
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

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/login");
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
  Class.find({ owner: req.session.userId })
    .then((classes) => {
      console.log(classes);
      res.render("home.hbs", {
        classes: classes
      })
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

app.get("/addclass", validateUser, (req, res) => {
    res.render("add-class.hbs");
})

const calculate = (gradeWant, gradeNow, percentTest) => {
  //Grade = Exam Worth × Exam Score + (100% − Exam Worth) × Current Grade
  let x = gradeWant - (1 - (0.01*percentTest)) * gradeNow;
  return x / (0.01*percentTest);
}

app.delete("/addclass/:id", (req, res) => {
  const id = req.params.id;
  Class.findByIdAndRemove(id)
     .then(userClass => {
       console.log("Successful delete");
       res.redirect("/home");
     })
     .catch(e => {
       res.status(500).send(e);
     })
})

app.post("/addclass", (req, res) => {
  const userClass = new Class({
    className: req.body.className,
    presentGrade: req.body.presentGrade,
    wantedGrade: req.body.wantedGrade,
    percentTest: req.body.percentTest,
    neededGrade: calculate(req.body.wantedGrade, req.body.presentGrade, req.body.percentTest),
    owner: req.session.userId
  })
  userClass.save()
    .then((user) => {
      res.redirect("/home");
    })
    .catch(e => {
      //make speific error for duplicate name
      console.log(e);
      req.flash("errorMessages", {message: "Error. Could not add class."});
      res.redirect("/addclass");
    })
})

app.get("/addclass/edit/:id", validateUser, (req, res) => {
    const id = req.params.id;
    console.log(id);
    Class.findById(id)
      .then(userClass => {
        console.log(userClass);
          res.render("edit-class.hbs", {
            userClass: userClass
          });
      })
      .catch(e => {
        console.log(e);
        req.flash("errorMessages", {message: "Error. Could not edit class."});
        res.redirect("/home");
      })
})

app.patch("/addclass/edit/:id", (req, res) => {
  console.log("Hit patch route");
  const id = req.params.id;
  //update grade needed
  Class.findByIdAndUpdate(id, req.body, {new: true})
     .then(userClass => {
       res.redirect("/home");
     })
     .catch(e => {
       console.log(e);
       req.flash("errorMessages", {message: "Error. Could not edit class."});
       res.redirect("/home");
     })
})

app.get("/forgotpassword", (req, res) => {
  res.render("forgot-password.hbs");
})

app.post("/forgotpassword", (req, res) => {
  //do email stuff

  const email = req.body.email;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'zagehub@gmail.com',
      pass: 'z@geHub18'
    }
  });

  const mailOptions = {
    from: 'zagehub@gmail.com',
    to: email,
    subject: 'Resetting Password',
    html: '<p>Click <a href=`http://localhost:3000/resetpassword/${email}`><b>here</b></a> to reset your password</p>'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ', info.messageId);
    }
  });

  req.flash("successMessage", {message: "Successful. Please check you email to complete the process."});
  res.redirect("/login");
})

app.get("/resetpassword/:userEmail", (req, res) => {
  const userEmail = req.params.userEmail;
  res.render("reset-password.hbs", {
    userEmail: userEmail
  });
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
