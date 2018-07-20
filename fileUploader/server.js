const express = require("express");
const hbs = require("hbs");
//used for uploading files locally
//tell multer where to store the files (relative from the root directory of your project)
const multer = require("multer");
//part of node
const path = require("path");
const bodyParser = require("body-parser");

const upload = multer({ dest: "./public/images"})
const app = express();

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "/public")))
//using this version bc of 'multipart...'
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());

app.get("/", (req, res) => {
  //navigate from views
  res.render("index.hbs");
})

//look at multer docs
//.single(Name from front end) = uploading a single file
app.post("/", upload.single("uploadedFile"), (req, res) => {
  //res.file = file
  console.log(req.file);
  //res.body = any fields
  console.log(req.body);
})

app.listen(3000, () => {
  console.log("Listening on port 3000");
})
