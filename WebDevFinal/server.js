//Make sure everything is imported
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

require("dotenv").config();

const User = require("./models/user.js");
const mongoose = require("./db/mongoose.js");
const {validateUser} = require("./middleware/middleware.js");
