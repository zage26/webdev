const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'hbs');

// app.use(express.static(path.join(__dirname, "views")));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', (req, res) => {
  res.render('index.hbs', {
  })
})

app.post("/", (req, res) => {
    // res.render("index.hbs", {
    //
    // })
    console.log(req.body.user.name);
    let x = req.body.user.name;
    res.render("index.hbs", {
      name: x
    })
});

app.listen(3000, () => {
  console.log("Server is up on port 3000.");
})
