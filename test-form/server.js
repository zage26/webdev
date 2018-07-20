const express = require("express");
const hbs = require("hbs")
const bodyParser = require("body-parser");

const path = require("path");

const {mongoose} = require("./server/db/mongoose.js");
const {ComCalUser} = require("./server/models/comcal.js");

const app = express();

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({
    extended: true
}));

//LOGIN PAGE
app.get("/", (req, res) => {
  res.render("index.hbs");
})

const checkUsername = (usern) => {
  ComCalUser.find({username: usern})
    .then(docs => {
      console.log(docs.length === 0);
      if(docs.length === 0) {
        return true;
      }
      return false;
    }, e => {
      return false;
    })
  // console.log(ComCalUser.find({username: usern}).treeusername === []);
  // if(ComCalUser.find({username: usern}).tree.username === []) {
  //   return true;
  // }
  // return false;
    // .then(doc => {
    //   console.log(doc[0].username);
    //   return true;
    // }, e => {
    //   return e;
    // })
}

app.post("/", (req, res) => {
  // const username = req.body.username;
  // const password = req.body.password;
  // const body = req.body;
  // res.send(body);

  // console.log(checkUsername("zage26"));
  // console.log(checkUsername("test"));
  //
  // const newCCUser = new ComCalUser ({
  //   username: req.body.username,
  //   password: req.body.password
  // })
  //
  // const usern = req.body.username;

  // console.log(ComCalUser.find({username: usern}).tree.username);

  // console.log(checkUsername(usern));

  res.render("index.hbs", {
    username: req.body.username
  })

  // if(checkUsername(usern)) {
  //   newCCUser.save()
  //     .then(doc => {
  //       res.send(doc);
  //     }, e => {
  //       res.status(404).send(e);
  //     })
  // } else {
    // res.send("That username already exists.")
  // }

})

// app.post("/", (req, res) => {
//   const name = req.body.name;
//   const yn = req.body.yn;
//   // const body = req.body.yn;
//   res.render("index.hbs", {
//     name: name,
//     yn: yn
//   });
// })

app.listen(3000, () => {
  console.log("Server up on port 3000.");
})
